export enum ResponseType {
  None = 0,
  Recep = 1,
  OK = 2,
  Pending = 3,
  Ignore = 4,
  Reject = 5
}

export function allResponseTypeDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(ResponseType).filter(x => isNaN(Number(x))).forEach(x => {
    ret.push(StringToResponseTypeDesc[x]);
  })
  return ret;
}
export function stringToResponseType(data?: string): ResponseType {
  if (data == null) {
    return ResponseType.None
  }

  return StringToResponseType[data];
}
export function responseTypeToResponseTypeDesc(responseType?: ResponseType | string): string {
  if (typeof(responseType) == "string") {
    return StringToResponseTypeDesc[responseType];
  }
  return ResponseTypeDesc[responseType ?? ResponseType.None];
}
export const ResponseTypeDesc: { [key in ResponseType]: string } = {
  [ResponseType.None]: "미지정",
  [ResponseType.Recep]: "수신",
  [ResponseType.OK]: "완료",
  [ResponseType.Pending]: "팬딩",
  [ResponseType.Ignore]: "무시",
  [ResponseType.Reject]: "거부",
}
export const ResponseTypeToPropertyBackgroundName: { [key in ResponseType]: string } = {
  [ResponseType.None]: "--p-yellow-500",
  [ResponseType.Recep]: "--p-blue-500",
  [ResponseType.OK]: "--p-green-500",
  [ResponseType.Pending]: "--p-orange-500",
  [ResponseType.Ignore]: "--p-red-500",
  [ResponseType.Reject]: "--p-gray-500",
}
export const ResponseTypeToPropertyHoverBackgroundName: { [key in ResponseType]: string } = {
  [ResponseType.None]: "--p-yellow-400",
  [ResponseType.Recep]: "--p-blue-400",
  [ResponseType.OK]: "--p-green-400",
  [ResponseType.Pending]: "--p-orange-400",
  [ResponseType.Ignore]: "--p-red-400",
  [ResponseType.Reject]: "--p-gray-400",
}
export const StringToResponseTypeDesc: { [key in string]: string } = {
  "None": "미지정",
  "Recep": "수신",
  "OK": "완료",
  "Pending": "팬딩",
  "Ignore": "무시",
  "Reject": "거부",
}
export const StringToResponseType: { [key in string]: ResponseType } = {
  "None": ResponseType.None,
  "Recep": ResponseType.Recep,
  "OK": ResponseType.OK,
  "Pending": ResponseType.Pending,
  "Ignore": ResponseType.Ignore,
  "Reject": ResponseType.Reject,
}
export const ResponseTypeDescToResponseType: { [key in string]: ResponseType } = {
  "미지정":ResponseType.None,
  "수신":ResponseType.Recep,
  "완료":ResponseType.OK,
  "팬딩":ResponseType.Pending,
  "무시":ResponseType.Ignore,
  "거부":ResponseType.Reject,
}
export const stringToPropertyBackgroundName: { [key in string]: string } = {
  "None": "--p-yellow-500",
  "Recep": "--p-blue-500",
  "OK": "--p-green-500",
  "Pending": "--p-orange-500",
  "Ignore": "--p-red-500",
  "Reject": "--p-gray-500",
}
export const stringToPropertyHoverBackgroundName: { [key in string]: string } = {
  "None": "--p-yellow-400",
  "Recep": "--p-blue-400",
  "OK": "--p-green-400",
  "Pending": "--p-orange-400",
  "Ignore": "--p-red-400",
  "Reject": "--p-gray-400",
}
