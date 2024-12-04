import {MedicinePriceModel} from "./medicine-price-model";
import {MedicineSubModel} from "./medicine-sub-model";
import {MedicineIngredientModel} from "./medicine-ingredient-model";

export class MedicineModel {
  thisPK: string = "";
  code: number = 0;
  mainIngredientCode: string = "";
  kdCode: number = 0;
  standardCode: number = 0;
  pharma: string = "";
  name: string = ""
  customPrice: number = 0;
  maxPrice: number = 0;
  medicineSubModel: MedicineSubModel = new MedicineSubModel();
  medicineIngredientModel: MedicineIngredientModel = new MedicineIngredientModel();
  medicinePriceModel: MedicinePriceModel[] = [];
}
