export enum TextPosition {
  LT = "LT",
  RT = "RT",
  LB = "LB",
  RB = "RB",
}

export function allTextPositionDesc(): string[] {
  const ret: string[] = [];
  Object.keys(TextPosition).forEach(x => {
    ret.push(StringToTextPositionDesc[x]);
  });
  return ret;
}
export const TextPositionToTextPositionDesc: { [key in TextPosition]: string } = {
  [TextPosition.LT]: "좌상",
  [TextPosition.RT]: "우상",
  [TextPosition.LB]: "좌하",
  [TextPosition.RB]: "우하",
}
export const StringToTextPositionDesc: { [key in string]: string } = {
  "LT": "좌상",
  "RT": "우상",
  "LB": "좌하",
  "RB": "우하",
}
export const DescToTextPosition: { [key in string]: TextPosition } = {
  "좌상": TextPosition.LT,
  "우상": TextPosition.RT,
  "좌하": TextPosition.LB,
  "우하": TextPosition.RB,
}
