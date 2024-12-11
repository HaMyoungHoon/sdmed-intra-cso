import {Component} from "@angular/core";
import {FDialogComponentBase} from "../../../guards/f-dialog-component-base";
import {MedicineListService} from "../../../services/rest/medicine-list.service";
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {IconFieldModule} from "primeng/iconfield";
import {ImageModule} from "primeng/image";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {PickListModule} from "primeng/picklist";
import {ProgressSpinComponent} from "../progress-spin/progress-spin.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {MedicineModel} from "../../../models/rest/medicine-model";
import {allMedicineTypeDescArray, MedicineType, MedicineTypeDescToMedicineType, medicineTypeToMedicineTypeDesc} from "../../../models/rest/medicine-type";
import {allMedicineMethodDescArray, MedicineMethod, MedicineMethodDescToMedicineMethod, medicineMethodToMedicineMethodDesc} from "../../../models/rest/medicine-method";
import {allMedicineCategoryDescArray, MedicineCategory, MedicineCategoryDescToMedicineCategory, medicineCategoryToMedicineCategoryDesc} from "../../../models/rest/medicine-category";
import {allMedicineGroupDescArray, MedicineGroup, MedicineGroupDescToMedicineGroup, medicineGroupToMedicineGroupDesc} from "../../../models/rest/medicine-group";
import {allMedicineDivDescArray, MedicineDiv, MedicineDivDescToMedicineDiv, medicineDivToMedicineDivDesc} from "../../../models/rest/medicine-div";
import {allMedicineRankDescArray, MedicineRank, MedicineRankDescToMedicineRank, medicineRankToMedicineRankDesc} from "../../../models/rest/medicine-rank";
import {allMedicineStorageTempDescArray, MedicineStorageTemp, MedicineStorageTempDescToMedicineStorageTemp, medicineStorageTempToMedicineStorageTempDesc} from "../../../models/rest/medicine-storage-temp";
import {allMedicineStorageBoxDescArray, MedicineStorageBox, MedicineStorageBoxDescToMedicineStorageBox, medicineStorageBoxToMedicineStorageBoxDesc} from "../../../models/rest/medicine-storage-box";
import {UserRole} from "../../../models/rest/user-role";
import {restTry} from "../../../guards/f-extensions";
import {MedicineIngredientModel} from "../../../models/rest/medicine-ingredient-model";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";

@Component({
  selector: "app-medicine-edit-dialog",
  imports: [Button, CalendarModule, CardModule, CheckboxModule, DropdownModule, IconFieldModule, ImageModule, InputIconModule, InputTextModule, NgIf, PickListModule, ProgressSpinComponent, ReactiveFormsModule, TranslatePipe, FormsModule, AutoCompleteModule],
  templateUrl: "./medicine-edit-dialog.component.html",
  styleUrl: "./medicine-edit-dialog.component.scss",
  standalone: true
})
export class MedicineEditDialogComponent extends FDialogComponentBase{
  medicineModel: MedicineModel = new MedicineModel();
  medicineTypeList: string[] = allMedicineTypeDescArray();
  medicineMethodList: string[] = allMedicineMethodDescArray();
  medicineCategoryList: string[] = allMedicineCategoryDescArray();
  medicineGroupList: string[] = allMedicineGroupDescArray();
  medicineDivList: string[] = allMedicineDivDescArray();
  medicineRankList: string[] = allMedicineRankDescArray();
  medicineStorageTempList: string[] = allMedicineStorageTempDescArray();
  medicineStorageBoxList: string[] = allMedicineStorageBoxDescArray();
  selectMedicineType = medicineTypeToMedicineTypeDesc(MedicineType.General);
  selectMedicineMethod = medicineMethodToMedicineMethodDesc(MedicineMethod.ETC);
  selectMedicineCategory = medicineCategoryToMedicineCategoryDesc(MedicineCategory.ETC);
  selectMedicineGroup = medicineGroupToMedicineGroupDesc(MedicineGroup.Additional)
  selectMedicineDiv = medicineDivToMedicineDivDesc(MedicineDiv.Open);
  selectMedicineRank = medicineRankToMedicineRankDesc(MedicineRank.None);
  selectMedicineStorageTemp = medicineStorageTempToMedicineStorageTempDesc(MedicineStorageTemp.RoomTemp);
  selectMedicineStorageBox = medicineStorageBoxToMedicineStorageBoxDesc(MedicineStorageBox.Sealed);

  mainIngredientList: MedicineIngredientModel[] = [];
  filteredMainIngredientList: MedicineIngredientModel[] = [];
  selectedMainIngredient: MedicineIngredientModel = new MedicineIngredientModel();
  constructor(private thisService: MedicineListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.MedicineChanger));
    const dlg = this.dialogService.getInstance(this.ref);
    this.medicineModel = dlg.data;
  }

  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getMedicineData();
      await this.getMainIngredientList();
    }
  }

  async getMedicineData(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.thisService.getData(this.medicineModel.thisPK),
      e => this.fDialogService.error("getMedicineData", e));
    this.setLoading(false);
    if (ret.result) {
      this.medicineModel = ret.data ?? new MedicineModel();
      this.selectMedicineType = medicineTypeToMedicineTypeDesc(ret.data?.medicineSubModel.medicineType);
      this.selectMedicineMethod = medicineMethodToMedicineMethodDesc(ret.data?.medicineSubModel.medicineMethod);
      this.selectMedicineCategory = medicineCategoryToMedicineCategoryDesc(ret.data?.medicineSubModel.medicineCategory);
      this.selectMedicineGroup = medicineGroupToMedicineGroupDesc(ret.data?.medicineSubModel.medicineGroup);
      this.selectMedicineDiv = medicineDivToMedicineDivDesc(ret.data?.medicineSubModel.medicineDiv);
      this.selectMedicineRank = medicineRankToMedicineRankDesc(ret.data?.medicineSubModel.medicineRank);
      this.selectMedicineStorageTemp = medicineStorageTempToMedicineStorageTempDesc(ret.data?.medicineSubModel.medicineStorageTemp);
      this.selectMedicineStorageBox = medicineStorageBoxToMedicineStorageBoxDesc(ret.data?.medicineSubModel.medicineStorageBox);
      this.selectedMainIngredient = this.medicineModel.medicineIngredientModel;
      return;
    }
    this.fDialogService.warn("getMedicineData", ret.msg);
  }
  async getMainIngredientList(): Promise<void> {
    this.setLoading();
    const ret = await restTry(async() => await this.thisService.getMainIngredientList(),
      e => this.fDialogService.error("getMainIngredientList", e));
    this.setLoading(false);
    if (ret.result) {
      this.mainIngredientList = ret.data ?? [];
      this.filteredMainIngredientList = [...this.mainIngredientList];
      return;
    }
    this.fDialogService.warn("getMainIngredientList", ret.msg);
  }
  async saveData(): Promise<void> {
    this.medicineModel.medicineSubModel.medicineType = MedicineTypeDescToMedicineType[this.selectMedicineType];
    this.medicineModel.medicineSubModel.medicineMethod = MedicineMethodDescToMedicineMethod[this.selectMedicineMethod];
    this.medicineModel.medicineSubModel.medicineCategory = MedicineCategoryDescToMedicineCategory[this.selectMedicineCategory];
    this.medicineModel.medicineSubModel.medicineGroup = MedicineGroupDescToMedicineGroup[this.selectMedicineGroup];
    this.medicineModel.medicineSubModel.medicineDiv = MedicineDivDescToMedicineDiv[this.selectMedicineDiv];
    this.medicineModel.medicineSubModel.medicineRank = MedicineRankDescToMedicineRank[this.selectMedicineRank];
    this.medicineModel.medicineSubModel.medicineStorageTemp = MedicineStorageTempDescToMedicineStorageTemp[this.selectMedicineStorageTemp];
    this.medicineModel.medicineSubModel.medicineStorageBox = MedicineStorageBoxDescToMedicineStorageBox[this.selectMedicineStorageBox];
    this.medicineModel.mainIngredientCode = this.selectedMainIngredient.mainIngredientCode;
    this.setLoading();
    const ret = await restTry(async() => await this.thisService.putData(this.medicineModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      this.ref.close(ret.data);
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }
  closeThis(): void {
    this.ref.close();
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
