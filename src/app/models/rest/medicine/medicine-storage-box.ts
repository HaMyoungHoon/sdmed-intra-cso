export enum MedicineStorageBox {
  Confidential = 0,
  Sealed = 1,
}

export function allMedicineStorageBoxDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(MedicineStorageBox).filter(x => isNaN(Number(x))).forEach(x => {
    ret.push(StringToMedicineStorageBoxDesc[x]);
  });
  return ret;
}
export function stringToMedicineStorageBox(data?: string): MedicineStorageBox {
  if (data == null) {
    return MedicineStorageBox.Confidential;
  }

  return StringToMedicineStorageBox[data];
}
export function medicineStorageBoxToMedicineStorageBoxDesc(medicineStorageBox?: MedicineStorageBox | string): string {
  if (typeof(medicineStorageBox) == "string") {
    return StringToMedicineStorageBoxDesc[medicineStorageBox];
  }
  return MedicineStorageBoxDesc[medicineStorageBox ?? MedicineStorageBox.Confidential];
}
export const MedicineStorageBoxDesc: { [key in MedicineStorageBox]: string } = {
  [MedicineStorageBox.Confidential]: "기밀",
  [MedicineStorageBox.Sealed]: "밀봉",
}
export const StringToMedicineStorageBoxDesc: { [key in string]: string } = {
  "Confidential": "기밀",
  "Sealed": "밀봉",
}
export const StringToMedicineStorageBox: { [key in string]: MedicineStorageBox } = {
  "Confidential": MedicineStorageBox.Confidential,
  "Sealed": MedicineStorageBox.Sealed,
}
export const MedicineStorageBoxDescToMedicineStorageBox: { [key in string]: MedicineStorageBox } = {
  "기밀": MedicineStorageBox.Confidential,
  "밀봉": MedicineStorageBox.Sealed,
}
