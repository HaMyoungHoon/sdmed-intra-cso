export enum ContractType {
  None = 0,
  Veterinary = 1,
  Competitive = 2
}

export function allContractTypeDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(ContractType).filter(x => isNaN(Number(x))).forEach(x => {
    ret.push(StringToContractTypeDesc[x]);
  });
  return ret;
}
export function stringToContractType(data?: string): ContractType {
  if (data == null) {
    return ContractType.None;
  }

  return StringToContractType[data];
}
export function contractTypeToContractTypeDesc(contractType?: ContractType | string): string {
  if (typeof(contractType) == "string") {
    return StringToContractTypeDesc[contractType];
  }
  return ContractTypeDesc[contractType ?? ContractType.None];
}
export const ContractTypeDesc: { [key in ContractType]: string } = {
  [ContractType.None]: "미지정",
  [ContractType.Veterinary]: "수의계약",
  [ContractType.Competitive]: "경쟁입찰",
}
export const StringToContractTypeDesc: { [key in string]: string } = {
  "None": "미지정",
  "Veterinary": "수의계약",
  "Competitive": "경쟁입찰",
}
export const StringToContractType: { [key in string]: ContractType } = {
  "None": ContractType.None,
  "Veterinary": ContractType.Veterinary,
  "Competitive": ContractType.Competitive,
}
export const ContactTypeDescToContactType: { [key in string]: ContractType } = {
  "미지정": ContractType.None,
  "수의계약": ContractType.Veterinary,
  "경쟁입찰": ContractType.Competitive,
}
