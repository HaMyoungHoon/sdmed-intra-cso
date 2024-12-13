export enum RequestType {
  SignUp = 1,
  EDIUpload = 2
}

export function allRequestTypeDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(RequestType).filter(x => isNaN(Number(x))).forEach(x => {
    ret.push(StringToRequestTypeDesc[x]);
  })
  return ret;
}
export function stringToRequestType(data?: string): RequestType {
  if (data == null) {
    return RequestType.SignUp
  }

  return StringToRequestType[data];
}
export function requestTypeToRequestTypeDesc(requestType?: RequestType | string): string {
  if (typeof(requestType) == "string") {
    return StringToRequestTypeDesc[requestType];
  }
  return RequestTypeDesc[requestType ?? RequestType.SignUp];
}
export const RequestTypeDesc: { [key in RequestType]: string } = {
  [RequestType.SignUp]: "회원가입",
  [RequestType.EDIUpload]: "EDI업로드"
}
export const StringToRequestTypeDesc: { [key in string]: string } = {
  "SignUp": "회원가입",
  "EDIUpload": "EDI업로드"
}
export const StringToRequestType: { [key in string]: RequestType } = {
  "SignUp": RequestType.SignUp,
  "EDIUpload": RequestType.EDIUpload
}
export const RequestTypeDescToRequestType: { [key in string]: RequestType } = {
  "회원가입": RequestType.SignUp,
  "EDI업로드": RequestType.EDIUpload
}
