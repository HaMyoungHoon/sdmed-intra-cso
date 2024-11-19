export enum UserStatus {
  None = 0,
  Live = 1,
  Stop = 2,
  Delete = 3,
  Expired = 4,
}

export const UserStatusDescriptions: { [key in UserStatus]: string} = {
  [UserStatus.None]: "미지정",
  [UserStatus.Live]: "라이브",
  [UserStatus.Stop]: "중지됨",
  [UserStatus.Delete]: "삭제됨",
  [UserStatus.Expired]: "만료됨",
}
