export enum MedicineType {
  General = 0,
  Expert = 1,
}

export function allMedicineTypeDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(MedicineType).filter(x => isNaN(Number(x))).forEach(x => {
    ret.push(StringToMedicineTypeDesc[x]);
  });
  return ret;
}
export function stringToMedicineType(data?: string): MedicineType {
  if (data == null) {
    return MedicineType.General;
  }

  return StringToMedicineType[data];
}
export function medicineTypeToMedicineTypeDesc(medicineType?: MedicineType | string): string {
  if (typeof(medicineType) == "string") {
    return StringToMedicineTypeDesc[medicineType];
  }
  return MedicineTypeDesc[medicineType ?? MedicineType.General];
}
export const MedicineTypeDesc: { [key in MedicineType]: string } = {
  [MedicineType.General]: "일반",
  [MedicineType.Expert]: "전문",
}
export const StringToMedicineTypeDesc: { [key in string]: string } = {
  "None": "일반",
  "Recipient": "전문",
}
export const StringToMedicineType: { [key in string]: MedicineType } = {
  "None": MedicineType.General,
  "Recipient": MedicineType.Expert,
}
export const MedicineTypeDescToMedicineType: { [key in string]: MedicineType } = {
  "일반": MedicineType.General,
  "전문": MedicineType.Expert,
}
