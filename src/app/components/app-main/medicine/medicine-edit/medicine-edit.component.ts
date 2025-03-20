import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {MedicineModel} from "../../../../models/rest/medicine/medicine-model";
import {allMedicineDivDescArray, MedicineDiv, MedicineDivDescToMedicineDiv, medicineDivToMedicineDivDesc} from "../../../../models/rest/medicine/medicine-div";
import {MedicineIngredientModel} from "../../../../models/rest/medicine/medicine-ingredient-model";
import {MedicineListService} from "../../../../services/rest/medicine-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {ActivatedRoute} from "@angular/router";
import {PharmaModel} from "../../../../models/rest/pharma/pharma-model";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: "app-medicine-edit",
  templateUrl: "./medicine-edit.component.html",
  styleUrl: "./medicine-edit.component.scss",
  standalone: false,
})
export class MedicineEditComponent extends FComponentBase {
  pharmaList: PharmaModel[] = [];
  selectPharma?: PharmaModel;
  medicineModel: MedicineModel = new MedicineModel();
  medicineDivList: string[] = allMedicineDivDescArray();
  selectMedicineDiv = medicineDivToMedicineDivDesc(MedicineDiv.Open);

  mainIngredientList: MedicineIngredientModel[] = [];
  filteredMainIngredientList: MedicineIngredientModel[] = [];
  selectedMainIngredient: MedicineIngredientModel = new MedicineIngredientModel();
  constructor(private thisService: MedicineListService, private route: ActivatedRoute) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.MedicineChanger));
    this.medicineModel.thisPK = this.route.snapshot.params["thisPK"];
  }

  override async ngInit(): Promise<void> {
    this.subscribeRouter();
  }
  subscribeRouter(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.route.params.pipe(takeUntil(sub)).subscribe(async(x) => {
      this.medicineModel.thisPK = x["thisPK"];
      await this.refreshData();
    });
  }

  async refreshData(): Promise<void> {
    this.setLoading();
    await this.getMedicineData();
    this.setLoading(false);
  }
  async getMedicineData(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.medicineModel.thisPK),
      e => this.fDialogService.error("getMedicineData", e));
    if (ret.result) {
      this.medicineModel = ret.data ?? new MedicineModel();
      this.selectMedicineDiv = medicineDivToMedicineDivDesc(ret.data?.medicineDiv);
      this.selectedMainIngredient = this.medicineModel.medicineIngredientModel;
      await this.getMainIngredientList();
      return;
    }
    this.fDialogService.warn("getMedicineData", ret.msg);
  }
  async getMainIngredientList(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.getMainIngredientList(),
      e => this.fDialogService.error("getMainIngredientList", e));
    if (ret.result) {
      this.mainIngredientList = ret.data ?? [];
      this.filteredMainIngredientList = [...this.mainIngredientList];
      await this.getPharmaList();
      return;
    }
    this.fDialogService.warn("getMainIngredientList", ret.msg);
  }
  async getPharmaList(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.getPharmaList(),
      e => this.fDialogService.error("getPharmaList", e));
    if (ret.result) {
      this.pharmaList = ret.data ?? [];
      this.selectPharma = this.pharmaList.find(x => x.code == this.medicineModel.makerCode);
      return;
    }
    this.fDialogService.warn("getPharmaList", ret.msg);
  }
  async saveData(): Promise<void> {
    if (this.selectPharma == null) {
      this.translateService.get("medicine-edit.warn.maker").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    this.medicineModel.medicineDiv = MedicineDivDescToMedicineDiv[this.selectMedicineDiv];
    this.medicineModel.mainIngredientCode = this.selectedMainIngredient.mainIngredientCode;
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.putData(this.medicineModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }

  filterAutoComplete(event: AutoCompleteCompleteEvent): void {
    const query: string = event.query;
    if (query.length < 3) {
      this.filteredMainIngredientList = [];
      return;
    }
    this.filteredMainIngredientList = [...this.mainIngredientList.filter(x =>
      x.mainIngredientName.toLowerCase().includes(query) || x.mainIngredientCode.toLowerCase().includes(query))
    ];
  }
}
