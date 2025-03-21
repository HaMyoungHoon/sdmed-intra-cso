import {Component} from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {MedicineListService} from "../../../../services/rest/medicine-list.service";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {ProgressSpinComponent} from "../../progress-spin/progress-spin.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {MedicineModel} from "../../../../models/rest/medicine/medicine-model";
import {allMedicineDivDescArray, MedicineDiv, MedicineDivDescToMedicineDiv, medicineDivToMedicineDivDesc} from "../../../../models/rest/medicine/medicine-div";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import {MedicineIngredientModel} from "../../../../models/rest/medicine/medicine-ingredient-model";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {Select} from "primeng/select";
import {PharmaModel} from "../../../../models/rest/pharma/pharma-model";
import {IftaLabel} from "primeng/iftalabel";

@Component({
  selector: "app-medicine-edit-dialog",
  imports: [ButtonModule, CardModule, CheckboxModule, ImageModule, InputTextModule, NgIf, ProgressSpinComponent, ReactiveFormsModule, TranslatePipe, FormsModule, AutoCompleteModule, Select, IftaLabel],
  templateUrl: "./medicine-edit-dialog.component.html",
  styleUrl: "./medicine-edit-dialog.component.scss",
  standalone: true
})
export class MedicineEditDialogComponent extends FDialogComponentBase{
  pharmaList: PharmaModel[] = [];
  selectMaker?: PharmaModel;
  selectClient?: PharmaModel;
  medicineModel: MedicineModel = new MedicineModel();
  medicineDivList: string[] = allMedicineDivDescArray();
  selectMedicineDiv = medicineDivToMedicineDivDesc(MedicineDiv.Open);

  mainIngredientList: MedicineIngredientModel[] = [];
  filteredMainIngredientList: MedicineIngredientModel[] = [];
  selectedMainIngredient: MedicineIngredientModel = new MedicineIngredientModel();
  constructor(private thisService: MedicineListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.MedicineChanger));
    const dlg = this.dialogService.getInstance(this.ref);
    this.medicineModel = dlg.data;
  }

  override async ngInit(): Promise<void> {
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
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getMainIngredientList(),
      e => this.fDialogService.error("getMainIngredientList", e));
    this.setLoading(false);
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
      this.selectMaker = this.pharmaList.find(x => x.code == this.medicineModel.makerCode);
      this.selectClient = this.pharmaList.find(x => x.code == this.medicineModel.clientCode);
      return;
    }
    this.fDialogService.warn("getPharmaList", ret.msg);
  }

  async saveData(): Promise<void> {
    if (this.selectMaker == null) {
      this.translateService.get("medicine-edit.warn.maker").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    if (this.selectClient == null) {
      this.translateService.get("medicine-edit.warn.client").subscribe(x => {
        this.fDialogService.warn("saveData", x);
      });
      return;
    }
    this.medicineModel.makerCode = this.selectMaker.code;
    this.medicineModel.clientCode = this.selectClient.code;
    this.medicineModel.medicineDiv = MedicineDivDescToMedicineDiv[this.selectMedicineDiv];
    this.medicineModel.mainIngredientCode = this.selectedMainIngredient.mainIngredientCode;
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.putData(this.medicineModel),
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
