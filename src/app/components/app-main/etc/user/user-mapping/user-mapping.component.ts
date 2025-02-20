import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserDataModel} from "../../../../../models/rest/user/user-data-model";
import {HospitalModel} from "../../../../../models/rest/hospital/hospital-model";
import {PharmaModel} from "../../../../../models/rest/pharma/pharma-model";
import {MedicineModel} from "../../../../../models/rest/medicine/medicine-model";
import {UserRole} from "../../../../../models/rest/user/user-role";
import {debounceTime, Subject, Subscription, takeUntil} from "rxjs";
import {HosPharmaMedicinePairModel} from "../../../../../models/rest/user/hos-pharma-medicine-pair-model";
import * as FExtensions from "../../../../../guards/f-extensions";
import {UserMappingService} from "../../../../../services/rest/user-mapping.service";
import {saveAs} from "file-saver";

@Component({
  selector: "app-user-mapping",
  templateUrl: "./user-mapping.component.html",
  styleUrl: "./user-mapping.component.scss",
  standalone: false
})
export class UserMappingComponent extends FComponentBase {
  @ViewChild("inputUploadExcel") inputUploadExcel!: ElementRef<HTMLInputElement>
  userList: UserDataModel[] = [];
  selectUser?: UserDataModel;

  isHosSearchTypeCode: boolean = false;
  hosSearchValue: string = "";
  hosSearchLoading: boolean = false;
  hosSearchSubject: Subject<string> = new Subject<string>();
  hosSearchObserver?: Subscription;
  hosSearchDebounceTime: number = 1000;
  hosList: HospitalModel[] = [];
  hosPickListUser?: UserDataModel;
  selectHos?: HospitalModel;

  isPharmaSearchTypeCode: boolean = false;
  pharmaSearchValue: string = "";
  pharmaSearchLoading: boolean = false;
  pharmaSearchSubject: Subject<string> = new Subject<string>();
  pharmaSearchObserver?: Subscription;
  pharmaSearchDebounceTime: number = 1000;
  pharmaList: PharmaModel[] = [];
  selectPharma?: PharmaModel;

  medicineList: MedicineModel[] = [];

  constructor(private thisService: UserMappingService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
  }

  override async ngInit(): Promise<void> {
    await this.getAllList();
    this.initSearch();
  }
  async save(): Promise<void> {
    const thisPK = this.hosPickListUser?.thisPK;
    if (thisPK == null) {
      return;
    }
    this.setLoading();
    const hosPharmaMedicinePairModel: HosPharmaMedicinePairModel[] = this.mergePairModel();
    if (hosPharmaMedicinePairModel.length <= 0) {
      this.translateService.get("user-mapping.save.warn-hos").subscribe(y => {
        this.fDialogService.warn("save", y);
      });
      this.setLoading(false);
      return;
    }
    if (hosPharmaMedicinePairModel.find(x => x.pharmaPK.length <= 0)) {
      const findHos = this.hosPickListUser?.hosList.find(x => x.thisPK == hosPharmaMedicinePairModel.find(y => y.pharmaPK.length <= 0)?.hosPK);
      this.translateService.get("user-mapping.save.warn-pharma").subscribe(y => {
        this.fDialogService.warn("save", `${y}\n${findHos?.innerName}`);
      });
      this.setLoading(false);
      return;
    }
    // 약품 정보가 없어도 저장 할 수 있었으면 좋겠다고 함
    // 근데 해보니까 그렇게 하면 안됨
    if (hosPharmaMedicinePairModel.find(x => x.medicinePK.length <= 0)) {
      const findPharma = this.hosPickListUser?.hosList.find(x => x.pharmaList.find(y => y.thisPK == hosPharmaMedicinePairModel.find(z => z.medicinePK.length <= 0)?.pharmaPK));
      this.translateService.get("user-mapping.save.warn-medicine").subscribe(y => {
        this.fDialogService.warn("save", `${y}\n${findPharma?.innerName}->${findPharma?.pharmaList[0].innerName}`);
      });
      this.setLoading(false);
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.putUserRelationModifyByPK(thisPK, hosPharmaMedicinePairModel),
        e => this.fDialogService.error("save", e));
    this.setLoading(false);
    if (ret.result) {
      return;
    }
    this.fDialogService.warn("save", ret.msg);
  }
  async refresh(): Promise<void> {
    await this.getAllList();
    await this.hosSearch();
    await this.pharmaSearch();
    await this.pharmaSearch();
  }
  uploadExcel(): void {
    this.inputUploadExcel.nativeElement.click();
  }
  async sampleDown(): Promise<void> {
    this.thisService.getExcelSample().then(x => {
      const blob = URL.createObjectURL(x.body);
      saveAs(blob, "userMappingSample.xlsx");
    }).catch(x => {
      this.fDialogService.error("sampleDown", x.message);
    });
  }
  async excelSelected(event: any): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.setLoading();
      const ret = await FExtensions.restTry(async() => await this.thisService.postExcel(file),
        e => this.fDialogService.error("excel upload", e));
      this.setLoading(false);
      this.inputUploadExcel.nativeElement.value = "";
      if (ret.result) {
        await this.getAllList();
        this.fDialogService.success("excel upload", ret.data);
        return;
      }
      this.fDialogService.warn("excel upload", ret.msg);
    }
  }
  mergePairModel(): HosPharmaMedicinePairModel[] {
    const ret: HosPharmaMedicinePairModel[] = [];
    this.hosPickListUser?.hosList?.forEach(x => {
      let pushedHos = false;
      x.pharmaList.forEach(y => {
        let pushedPharma = false;
        y.relationMedicineList.forEach(z => {
          ret.push(FExtensions.applyClass(HosPharmaMedicinePairModel, (obj) => {
            obj.hosPK = x.thisPK;
            obj.pharmaPK = y.thisPK;
            obj.medicinePK = z.thisPK;
          }));
          pushedPharma = true;
          pushedHos = true;
        });
        if (!pushedPharma) {
          ret.push(FExtensions.applyClass(HosPharmaMedicinePairModel, (obj) => {
            obj.hosPK = x.thisPK;
            obj.pharmaPK = y.thisPK;
          }));
          pushedHos = true;
        }
      });
      if (!pushedHos) {
        ret.push(FExtensions.applyClass(HosPharmaMedicinePairModel, (obj) => {
          obj.hosPK = x.thisPK;
        }));
      }
    });
    return ret;
  }

  async getAllList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(),
        e => this.fDialogService.error("getAllList", e));
    this.setLoading(false);
    if (ret.result) {
      this.userList = ret.data ?? [];
      return;
    }
    this.fDialogService.warn("getAllList", ret.msg);
  }
  initSearch(): void {
    const sub1 = new Subject<any>();
    this.sub.push(sub1);
    this.hosSearchObserver = this.hosSearchSubject.pipe(debounceTime(this.hosSearchDebounceTime))
      .pipe(takeUntil(sub1)).subscribe(async() => {
        this.hosSearchLoading = false;
        await this.hosSearch();
    });
    const sub2 = new Subject<any>();
    this.sub.push(sub2);
    this.pharmaSearchObserver = this.pharmaSearchSubject.pipe(debounceTime(this.pharmaSearchDebounceTime))
      .pipe(takeUntil(sub2)).subscribe(async() => {
        this.pharmaSearchLoading = false;
        await this.pharmaSearch();
      });
  }

  async userListOnSelect(_: any): Promise<void> {
    const buff = this.selectUser;
    this.selectHos = undefined;
    this.selectPharma = undefined;
    if (buff == null) {
      this.hosPickListUser = undefined;
      return;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(buff.thisPK, true, true, true),
      e => this.fDialogService.error("userSelect", e));
    this.setLoading(false);
    if (ret.result) {
      this.hosPickListUser = ret.data;
      await this.hosSearch();
      await this.pharmaSearch();
      await this.medicineSearch();
      return;
    }
    this.fDialogService.warn("userSelect", ret.msg);
  }

  get sourceHosList(): HospitalModel[] {
    return this.hosPickListUser?.hosList ?? [];
  }
  set sourceHosList(data: HospitalModel[]) {
    if (this.hosPickListUser) {
      this.hosPickListUser.hosList = data;
    }
  }
  get hosSearchStyle(): string {
    if (this.hosSearchLoading) return "pi pi-spinner pi-spin";
    else return "pi pi-search";
  }
  get hosSearchPlaceHolder(): string {
    if (this.isHosSearchTypeCode) return "user-mapping.hos-pick-list.search-code";
    else return "user-mapping.hos-pick-list.search-name";
  }
  async hosSearchChange(data: any): Promise<void> {
    if (this.isMobile) {
      this.hosSearchLoading = true;
      this.hosSearchSubject.next(data.data);
      return;
    }
    if (data.key == "Enter") {
      this.hosSearchLoading = true;
      await this.hosSearch();
      this.hosSearchLoading = false;
    }
  }
  async hosSearch(): Promise<void> {
    if (this.hosSearchValue.length <= 0) {
      this.hosList = [];
      return;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getHospitalAllSearch(this.hosSearchValue, this.isHosSearchTypeCode),
      e => this.fDialogService.error("hosSearch", e));
    this.setLoading(false);
    if (ret.result) {
      this.hosList = ret.data ?? [];
      this.hosList = this.hosList.filter(x => !this.sourceHosList.some(y => y.thisPK == x.thisPK));
      return;
    }
    this.fDialogService.warn("hosSearch", ret.msg);
  }
  get hosPickListDisable(): boolean {
    return this.hosPickListUser == null;
  }
  async hosPickListTargetSelect2(event: any): Promise<void> {
//    this.selectHos = event;
    await this.pharmaSearch();
  }
  async hosPickListTargetSelect(event: any): Promise<void> {
    if (event.items.length > 1) {
      event.items.splice(0, event.items.length - 1);
    }
    if (event.items.length > 0) {
      this.selectHos = event.items[0];
    } else {
      this.selectHos = undefined;
    }
    await this.pharmaSearch();
  }

  get sourcePharmaList(): PharmaModel[] {
    const pharma = this.hosPickListUser?.hosList.find(x => x.thisPK == this.selectHos?.thisPK)?.pharmaList;
    return pharma ?? [];
  }
  get pharmaSearchStyle(): string {
    if (this.pharmaSearchLoading) return "pi pi-spinner pi-spin";
    else return "pi pi-search";
  }
  get pharmaSearchPlaceHolder(): string {
    if (this.isPharmaSearchTypeCode) return "user-mapping.pharma-pick-list.search-code";
    else return "user-mapping.pharma-pick-list.search-name";
  }
  async pharmaSearchChange(data: any): Promise<void> {
    if (this.isMobile) {
      this.pharmaSearchLoading = true;
      this.pharmaSearchSubject.next(data.data);
      return;
    }
    if (data.key == "Enter") {
      this.pharmaSearchLoading = true;
      await this.pharmaSearch();
      this.pharmaSearchLoading = false;
    }
  }
  async pharmaSearch(): Promise<void> {
    if (this.pharmaSearchValue.length <= 0) {
      this.pharmaList = [];
      return;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getPharmaAllSearch(this.pharmaSearchValue, this.isPharmaSearchTypeCode),
      e => this.fDialogService.error("pharmaSearch", e));
    this.setLoading(false);
    if (ret.result) {
      this.pharmaList = ret.data ?? [];
      this.pharmaList = this.pharmaList.filter(x => !this.sourcePharmaList.some(y => y.thisPK == x.thisPK));
      return;
    }
    this.fDialogService.warn("pharmaSearch", ret.msg);
  }
  get pharmaPickListDisable(): boolean {
    return this.selectHos == null;
  }
  async pharmaPickListTargetSelect2(data: any): Promise<void> {
//    this.selectPharma = data;
    await this.medicineSearch();
  }
  async pharmaPickListTargetSelect(event: any): Promise<void> {
    if (event.items.length > 1) {
      event.items.splice(0, event.items.length - 1);
    }
    if (event.items.length > 0) {
      this.selectPharma = event.items[0];
    } else {
      this.selectPharma = undefined;
    }
    await this.medicineSearch();
  }

  get sourceMedicineList(): MedicineModel[] {
    const medicine = this.sourcePharmaList.find(x => x.thisPK == this.selectPharma?.thisPK)?.relationMedicineList;
    return medicine ?? [];
  }
  get medicinePickListDisable(): boolean {
    return this.selectPharma == null;
  }
  async medicineSearch(): Promise<void> {
    const pharma = this.selectPharma;
    if (pharma == null) {
      this.medicineList = [];
      return;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getPharmaData(pharma.thisPK, true),
      e => this.fDialogService.error("medicineSearch", e));
    this.setLoading(false);
    if (ret.result) {
      this.medicineList = ret.data?.medicineList ?? [];
      if (this.selectPharma) {
        this.medicineList = this.medicineList.filter(x => !this.sourceMedicineList.some(y => y.thisPK == x.thisPK));
      }
      return;
    }
    this.fDialogService.warn("medicineSearch", ret.msg);
  }

  get hosFilterFields(): string[] {
    return ["code", "innerName"];
  }
  get hosFilterPlaceHolder(): string {
    return "user-mapping.hos-pick-list.filter-place-holder";
  }
  get pharmaFilterFields(): string[] {
    return ["code", "innerName"];
  }
  get pharmaFilterPlaceHolder(): string {
    return "user-mapping.pharma-pick-list.filter-place-holder";
  }
  get medicineFilterFields(): string[] {
    return ["code", "kdCode", "name"];
  }
  get medicineFilterPlaceHolder(): string {
    return "user-mapping.medicine-pick-list.filter-place-holder";
  }
  get uploadExcelTooltip(): string {
    return "common-desc.excel-upload";
  }
  get sampleDownloadTooltip(): string {
    return "common-desc.sample-download";
  }

  protected readonly ellipsis = FExtensions.ellipsis;
}
