import {MedicinePriceModel} from "./medicine-price-model";
import {MedicineIngredientModel} from "./medicine-ingredient-model";
import {MedicineDiv} from "./medicine-div";

export class MedicineModel {
  thisPK: string = "";
  makerName?: string = "";
  orgName: string = "";
  innerName: string = "";
  kdCode: string = "";
  customPrice: number = 0;
  charge: number = 0;
  standard: string = "";
  etc1: string = "";
  mainIngredientCode: string = "";
  code: string = "";
  makerCode: string = "";
  medicineDiv: MedicineDiv = MedicineDiv.Open;
  inVisible: boolean = false;
  clientName?: string = "";
  maxPrice: number = 0;
  medicineIngredientModel: MedicineIngredientModel = new MedicineIngredientModel();
  medicinePriceModel: MedicinePriceModel[] = [];

  init(data: MedicineModel): MedicineModel {
    this.thisPK = data.thisPK;
    this.code = data.code;
    this.mainIngredientCode = data.mainIngredientCode;
    this.kdCode = data.kdCode;
    this.clientName = data.clientName ?? "";
    this.makerName = data.makerName ?? "";
    this.makerCode = data.makerCode;
    this.orgName = data.orgName;
    this.innerName = data.innerName;
    this.customPrice = data.customPrice;
    this.charge = data.charge;
    this.maxPrice = data.maxPrice;
    this.inVisible = data.inVisible;
    this.medicineIngredientModel = data.medicineIngredientModel;
    this.medicinePriceModel = data.medicinePriceModel;
    return this;
  }
  copyLhsFromRhs(lhs: MedicineModel, rhs: MedicineModel): void {
    lhs.thisPK = rhs.thisPK;
    lhs.code = rhs.code;
    lhs.mainIngredientCode = rhs.mainIngredientCode;
    lhs.kdCode = rhs.kdCode;
    lhs.clientName = rhs.clientName ?? "";
    lhs.makerName = rhs.makerName ?? "";
    lhs.makerCode = rhs.makerCode;
    lhs.orgName = rhs.orgName;
    lhs.innerName = rhs.innerName;
    lhs.customPrice = rhs.customPrice;
    lhs.charge = rhs.charge;
    lhs.maxPrice = rhs.maxPrice;
    lhs.inVisible = rhs.inVisible;
    lhs.medicineIngredientModel = rhs.medicineIngredientModel;
    lhs.medicinePriceModel = rhs.medicinePriceModel;
  }
}
