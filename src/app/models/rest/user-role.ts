export enum UserRole {
  None = 0,
  Admin = 1,
  CsoAdmin = Admin.valueOf() << 1,
  Employee = Admin.valueOf() << 2,
  BusinessMan = Admin.valueOf() << 3,
  PasswordChanger = Admin.valueOf() << 4,
  StatusChanger = Admin.valueOf() << 5,
  RoleChanger = Admin.valueOf() << 6,
  DeptChanger = Admin.valueOf() << 7,
  UserChildChanger = Admin.valueOf() << 8,
  UserFileUploader = Admin.valueOf() << 9,
  CorrespondentFileUploader = Admin.valueOf() << 10,
  PharmaFileUploader = Admin.valueOf() << 11,
  HospitalFileUploader = Admin.valueOf() << 12,
}

export function flagToRole(flags?: number): UserRole[] {
  if (flags == null) {
    return [UserRole.None];
  }
  return Object.values(UserRole).filter((x) => {
    if (typeof x === "number") {
      return (flags & x) !== 0;
    }
    return false;
  }) as UserRole[];
}
export function roleToFlag(role: UserRole[]): number {
  return role.reduce((flag, x) => flag | x, 0);
}
export function roleToString(role: UserRole[]): string[] {
  return role.map((x) => UserRole[x]);
}
export function flagToRoleDesc(flags?: number): string[] {
  let ret: string[] = [];
  roleToString(flagToRole(flags)).forEach(x => {
    ret.push(StringToUserRoleDesc[x]);
  });
  return ret;
}
export const StringToUserRoleDesc: { [key in string]: string } = {
  "None" : "미지정",
  "Admin" : "슈퍼관리자",
  "CsoAdmin" : "관리자",
  "Employee" : "직원",
  "BusinessMan" : "영업",
  "PasswordChanger" : "PasswordChanger",
  "StatusChanger" : "StatusChanger",
  "RoleChanger" : "RoleChanger",
  "DeptChanger" : "DeptChanger",
  "UserChildChanger" : "UserChildChanger",
  "UserFileUploader" : "UserFileUploader",
  "CorrespondentFileUploader" : "CorrespondentFileUploader",
  "PharmaFileUploader" : "PharmaFileUploader",
  "HospitalFileUploader" : "HospitalFileUploader",
}
