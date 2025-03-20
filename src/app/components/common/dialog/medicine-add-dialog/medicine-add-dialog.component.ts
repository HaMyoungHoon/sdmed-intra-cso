import { Component } from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {MedicineListService} from "../../../../services/rest/medicine-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {ProgressSpinComponent} from "../../progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";
import {MedicineModel} from "../../../../models/rest/medicine/medicine-model";
import {allMedicineDivDescArray, MedicineDiv, MedicineDivDescToMedicineDiv, medicineDivToMedicineDivDesc} from "../../../../models/rest/medicine/medicine-div";
import * as FExtensions from "../../../../guards/f-extensions";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {MedicineIngredientModel} from "../../../../models/rest/medicine/medicine-ingredient-model";
import {FormsModule} from "@angular/forms";
import {Select} from "primeng/select";
import {PharmaModel} from "../../../../models/rest/pharma/pharma-model";

@Component({
  selector: "app-medicine-add-dialog",
  imports: [ButtonModule, CardModule, InputTextModule, NgIf, PaginatorModule, ProgressSpinComponent, TranslatePipe, AutoCompleteModule, FormsModule, Select],
  templateUrl: "./medicine-add-dialog.component.html",
  styleUrl: "./medicine-add-dialog.component.scss",
  standalone: true,
})
export class MedicineAddDialogComponent extends FDialogComponentBase {
  pharmaList: PharmaModel[] = [];
  selectPharma?: PharmaModel;
  medicineModel: MedicineModel = new MedicineModel();
  medicineDivList: string[] = allMedicineDivDescArray();
  selectMedicineDiv = medicineDivToMedicineDivDesc(MedicineDiv.Open);

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
    this.medicineModel.makerCode = this.selectPharma?.code;
    this.medicineModel.medicineDiv = MedicineDivDescToMedicineDiv[this.selectMedicineDiv];
    this.medicineModel.mainIngredientCode = this.selectedMainIngredient.mainIngredientCode;
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.postData(this.medicineModel),
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
