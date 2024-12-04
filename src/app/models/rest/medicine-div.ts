export enum MedicineDiv {
  Open = 0,
  Close = 1,
}

export function allMedicineDivDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(MedicineDiv).filter(x => isNaN(Number(x))).forEach(x => {
    ret.push(StringToMedicineDivDesc[x]);
  });
  return ret;
}
export function stringToMedicineDiv(data?: string): MedicineDiv {
  if (data == null) {
    return MedicineDiv.Open;
  }

  return StringToMedicineDiv[data];
}
export function MedicineDivToMedicineDivDesc(medicineDiv?: MedicineDiv | string): string {
  if (typeof(medicineDiv) == "string") {
    return StringToMedicineDivDesc[medicineDiv];
  }
  return MedicineDivDesc[medicineDiv ?? MedicineDiv.Open];
}
export const MedicineDivDesc: { [key in MedicineDiv]: string } = {
  [MedicineDiv.Open]: "공개",
  [MedicineDiv.Close]: "비공개",
}
export const StringToMedicineDivDesc: { [key in string]: string } = {
  "Open": "공개",
  "Close": "비공개",
}
export const StringToMedicineDiv: { [key in string]: MedicineDiv } = {
  "Open": MedicineDiv.Open,
  "Close": MedicineDiv.Close,
}
export const MedicineDivDescToMedicineDiv: { [key in string]: MedicineDiv } = {
  "공개": MedicineDiv.Open,
  "비공개": MedicineDiv.Close,
}

