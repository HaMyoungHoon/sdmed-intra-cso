export enum DeliveryDiv {
  None = 0,
  Direct1 = 1,
  Direct2 = 2,
  Direct3 = 3,
  Parcel = 4
}

export function allDeliveryDivDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(DeliveryDiv).filter(x => isNaN(Number(x))).forEach(x => {
    ret.push(StringToDeliveryDivDesc[x]);
  });
  return ret;
}
export function stringToDeliveryDiv(data?: string): DeliveryDiv {
  if (data == null) {
    return DeliveryDiv.None;
  }

  return StringToDeliveryDiv[data];
}
export function deliveryDivToDeliveryDivDesc(deliveryDiv?: DeliveryDiv | string): string {
  if (typeof(deliveryDiv) == "string") {
    return StringToDeliveryDivDesc[deliveryDiv];
  }
  return DeliveryDivDesc[deliveryDiv ?? DeliveryDiv.None];
}
export const DeliveryDivDesc: { [key in DeliveryDiv]: string } = {
  [DeliveryDiv.None]: "미지정",
  [DeliveryDiv.Direct1]: "직배1호",
  [DeliveryDiv.Direct2]: "직배2호",
  [DeliveryDiv.Direct3]: "직배3호",
  [DeliveryDiv.Parcel]: "택배",
}
export const StringToDeliveryDivDesc: { [key in string]: string } = {
  "None": "미지정",
  "Direct1": "직배1호",
  "Direct2": "직배2호",
  "Direct3": "직배3호",
  "Parcel": "택배",
}
export const StringToDeliveryDiv: { [key in string]: DeliveryDiv } = {
  "None": DeliveryDiv.None,
  "Direct1": DeliveryDiv.Direct1,
  "Direct2": DeliveryDiv.Direct2,
  "Direct3": DeliveryDiv.Direct3,
  "Parcel": DeliveryDiv.Parcel,
}
export const DeliveryDivDescToDeliveryDiv: { [key in string]: DeliveryDiv } = {
  "미지정": DeliveryDiv.None,
  "직배1호": DeliveryDiv.Direct1,
  "직배2호": DeliveryDiv.Direct2,
  "직배3호": DeliveryDiv.Direct3,
  "택배": DeliveryDiv.Parcel,
}
