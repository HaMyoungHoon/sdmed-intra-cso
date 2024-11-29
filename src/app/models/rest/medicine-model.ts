import {MedicinePriceModel} from "./MedicinePriceModel";

export interface MedicineModel {
  thisPK: string;
  serialNumber: number;
  method: string;
  classify: string;
  mainIngredientCode: string;
  kdCode: string;
  name: string;
  pharmaName: string;
  standard: string;
  unit: string;
  general: boolean;
  maxPrice: number;
  ancestorCode: number;
  medicinePriceModel: MedicinePriceModel[]
}
