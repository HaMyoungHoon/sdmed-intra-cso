import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {MedicineModel} from "../../../../models/rest/medicine/medicine-model";
import {allMedicineTypeDescArray, MedicineType, MedicineTypeDescToMedicineType, medicineTypeToMedicineTypeDesc} from "../../../../models/rest/medicine/medicine-type";
import {allMedicineMethodDescArray, MedicineMethod, MedicineMethodDescToMedicineMethod, medicineMethodToMedicineMethodDesc} from "../../../../models/rest/medicine/medicine-method";
import {allMedicineCategoryDescArray, MedicineCategory, MedicineCategoryDescToMedicineCategory, medicineCategoryToMedicineCategoryDesc} from "../../../../models/rest/medicine/medicine-category";
import {allMedicineGroupDescArray, MedicineGroup, MedicineGroupDescToMedicineGroup, medicineGroupToMedicineGroupDesc} from "../../../../models/rest/medicine/medicine-group";
import {allMedicineDivDescArray, MedicineDiv, MedicineDivDescToMedicineDiv, medicineDivToMedicineDivDesc} from "../../../../models/rest/medicine/medicine-div";
import {allMedicineRankDescArray, MedicineRank, MedicineRankDescToMedicineRank, medicineRankToMedicineRankDesc} from "../../../../models/rest/medicine/medicine-rank";
import {allMedicineStorageTempDescArray, MedicineStorageTemp, MedicineStorageTempDescToMedicineStorageTemp, medicineStorageTempToMedicineStorageTempDesc} from "../../../../models/rest/medicine/medicine-storage-temp";
import {allMedicineStorageBoxDescArray, MedicineStorageBox, MedicineStorageBoxDescToMedicineStorageBox, medicineStorageBoxToMedicineStorageBoxDesc} from "../../../../models/rest/medicine/medicine-storage-box";
import {MedicineIngredientModel} from "../../../../models/rest/medicine/medicine-ingredient-model";
import {MedicineListService} from "../../../../services/rest/medicine-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {PharmaModel} from "../../../../models/rest/pharma/pharma-model";

@Component({
  selector: "app-medicine-add",
  templateUrl: "./medicine-add.component.html",
  styleUrl: "./medicine-add.component.scss",
  standalone: false,
})
export class MedicineAddComponent extends FComponentBase {
  pharmaList: PharmaModel[] = [];
  selectPharma?: PharmaModel;
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
  }
  override async ngInit(): Promise<void> {
    this.setLoading();
    await this.getMainIngredientList();
    this.setLoading(false);
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
      return;
    }
    this.fDialogService.warn("getPharmaList", ret.msg);
  }

  async saveData(): Promise<void> {
    if (this.medicineModel.code.length <= 0) {
      this.translateService.get("medicine-add.warn.code").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return
    }
    if (this.medicineModel.orgName.length <= 0) {
      this.translateService.get("medicine-add.warn.name").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    if (this.medicineModel.innerName.length <= 0) {
      this.translateService.get("medicine-add.warn.name").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    if (this.selectPharma == null) {
      this.translateService.get("medicine-add.warn.maker").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    this.medicineModel.makerName = this.selectPharma?.orgName;
    this.medicineModel.makerCode = this.selectPharma?.code;
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
    const ret = await FExtensions.restTry(async() => await this.thisService.postData(this.medicineModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      window.close();
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
