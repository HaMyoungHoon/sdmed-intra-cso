import {MedicinePriceModel} from "./medicine-price-model";
import {MedicineIngredientModel} from "./medicine-ingredient-model";
import {MedicineDiv} from "./medicine-div";

export class MedicineModel {
  thisPK: string = "";
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
  clientCode: string = "";
  makerName?: string = "";
  clientName?: string = "";
  medicineDiv: MedicineDiv = MedicineDiv.Open;
  inVisible: boolean = false;
  maxPrice: number = 0;
  medicineIngredientModel: MedicineIngredientModel = new MedicineIngredientModel();
  medicinePriceModel: MedicinePriceModel[] = [];

  init(data: MedicineModel): MedicineModel {
    this.thisPK = data.thisPK;
    this.orgName = data.orgName;
    this.innerName = data.innerName;
    this.kdCode = data.kdCode;
    this.customPrice = data.customPrice;
    this.charge = data.charge;
    this.standard = data.standard;
    this.etc1 = data.etc1;
    this.mainIngredientCode = data.mainIngredientCode;
    this.code = data.code;
    this.makerCode = data.makerCode;
    this.clientCode = data.clientCode;
    this.makerName = data.makerName;
    this.clientName = data.clientName;
    this.medicineDiv = data.medicineDiv;
    this.inVisible = data.inVisible;
    this.maxPrice = data.maxPrice;
    this.medicineIngredientModel = data.medicineIngredientModel;
    this.medicinePriceModel = data.medicinePriceModel;
    return this;
  }
  copyLhsFromRhs(lhs: MedicineModel, rhs: MedicineModel): void {
    lhs.thisPK = rhs.thisPK;
    lhs.orgName = rhs.orgName;
    lhs.innerName = rhs.innerName;
    lhs.kdCode = rhs.kdCode;
    lhs.customPrice = rhs.customPrice;
    lhs.charge = rhs.charge;
    lhs.standard = rhs.standard;
    lhs.etc1 = rhs.etc1;
    lhs.mainIngredientCode = rhs.mainIngredientCode;
    lhs.code = rhs.code;
    lhs.makerCode = rhs.makerCode;
    lhs.clientCode = rhs.clientCode;
    lhs.makerName = rhs.makerName;
    lhs.clientName = rhs.clientName;
    lhs.medicineDiv = rhs.medicineDiv;
    lhs.inVisible = rhs.inVisible;
    lhs.maxPrice = rhs.maxPrice;
    lhs.medicineIngredientModel = rhs.medicineIngredientModel;
    lhs.medicinePriceModel = rhs.medicinePriceModel;
  }
}
