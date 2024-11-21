export enum PharmaGroup {
  None = 0,
  Recipient = 1,
  Supplier = 2,
  ETC = 3,
  Pharmaceutical = 4,
}

export function stringToPharmaGroup(data?: string): PharmaGroup {
  if (data == null) {
    return PharmaGroup.None;
  }

  return StringToPharmaGroup[data];
}
export function pharmaGroupToPharmaGroupDesc(pharmaGroup?: PharmaGroup | string): string {
  if (typeof(pharmaGroup) == "string") {
    return StringToPharmaGroupDesc[pharmaGroup];
  }
  return PharmaGroupDesc[pharmaGroup ?? PharmaGroup.None];
}
export const PharmaGroupDesc: { [key in PharmaGroup]: string } = {
  [PharmaGroup.None]: "미지정",
  [PharmaGroup.Recipient]: "공급받는자",
  [PharmaGroup.Supplier]: "공급사",
  [PharmaGroup.ETC]: "기타",
  [PharmaGroup.Pharmaceutical]: "정산제약사",
}
export const StringToPharmaGroupDesc: { [key in string]: string } = {
  "None": "미지정",
  "Recipient": "공급받는자",
  "Supplier": "공급사",
  "ETC": "기타",
  "Pharmaceutical": "정산제약사",
}
export const StringToPharmaGroup: { [key in string]: PharmaGroup } = {
  "None": PharmaGroup.None,
  "Recipient": PharmaGroup.Recipient,
  "Supplier": PharmaGroup.Supplier,
  "ETC": PharmaGroup.ETC,
  "Pharmaceutical": PharmaGroup.Pharmaceutical,
}
