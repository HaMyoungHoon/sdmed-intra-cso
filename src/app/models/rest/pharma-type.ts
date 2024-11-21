export enum PharmaType {
  None = 0,
  ETC = 1,
  Wholesale = 2,
  GeneralHospital = 3,
  Pharmaceutical = 4,
}

export function stringToPharmaType(data?: string): PharmaType {
  if (data == null) {
    return PharmaType.None;
  }

  return StringToPharmaType[data];
}
export function pharmaTypeToPharmaTypeDesc(pharmaType?: PharmaType): string {
  if (typeof(pharmaType) == "string") {
    return StringToPharmaTypeDesc[pharmaType];
  }
  return PharmaTypeDesc[pharmaType ?? PharmaType.None];
}
export const PharmaTypeDesc: { [key in PharmaType]: string } = {
  [PharmaType.None]: "미지정",
  [PharmaType.ETC]: "기타",
  [PharmaType.Wholesale]: "도매업체",
  [PharmaType.GeneralHospital]: "종합병원",
  [PharmaType.Pharmaceutical]: "통계제약사",
}
export const StringToPharmaTypeDesc: { [key in string]: string } = {
  "None": "미지정",
  "ETC": "기타",
  "Wholesale": "도매업체",
  "GeneralHospital": "종합병원",
  "Pharmaceutical": "통계제약사",
}
export const StringToPharmaType: { [key in string]: PharmaType } = {
  "None": PharmaType.None,
  "ETC": PharmaType.ETC,
  "Wholesale": PharmaType.Wholesale,
  "GeneralHospital": PharmaType.GeneralHospital,
  "Pharmaceutical": PharmaType.Pharmaceutical,
}
