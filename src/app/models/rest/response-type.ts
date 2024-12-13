export enum ResponseType {
  None = 0,
  OK = 1,
  Pending = 2,
  Ignore = 3,
  Reject = 4
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
  [ResponseType.OK]: "완료",
  [ResponseType.Pending]: "팬딩",
  [ResponseType.Ignore]: "무시",
  [ResponseType.Reject]: "거부",
}
export const StringToResponseTypeDesc: { [key in string]: string } = {
  "None": "미지정",
  "OK": "완료",
  "Pending": "팬딩",
  "Ignore": "무시",
  "Reject": "거부",
}
export const StringToResponseType: { [key in string]: ResponseType } = {
  "None": ResponseType.None,
  "OK": ResponseType.OK,
  "Pending": ResponseType.Pending,
  "Ignore": ResponseType.Ignore,
  "Reject": ResponseType.Reject,
}
export const ResponseTypeDescToResponseType: { [key in string]: ResponseType } = {
  "미지정":ResponseType.None,
  "완료":ResponseType.OK,
  "팬딩":ResponseType.Pending,
  "무시":ResponseType.Ignore,
  "거부":ResponseType.Reject,
}
