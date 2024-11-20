export enum UserDept {
  None = 0,
  Admin = 1,
  CsoAdmin = Admin.valueOf() << 1,
  Employee = Admin.valueOf() << 2,
  Quitter = Admin.valueOf() << 3,
  TaxPayer = Admin.valueOf() << 4,
  Personal = Admin.valueOf() << 5,
  Terminate = Admin.valueOf() << 6,
}

export function flagToDept(flags?: number): UserDept[] {
  if (flags == null) {
    return [UserDept.None];
  }
  return Object.values(UserDept).filter((x) => {
    if (typeof x === "number") {
      return (flags & x) !== 0;
    }
    return false;
  }) as UserDept[];
}
export function deptToFlag(dept: UserDept[]): number {
  return dept.reduce((flag, x) => flag | x, 0);
}
export function deptToString(dept: UserDept[]): string[] {
  return dept.map((x) => UserDept[x]);
}
export function flagToDeptDesc(flags?: number): string[] {
  let ret: string[] = [];
  deptToString(flagToDept(flags)).forEach(x => {
    ret.push(StringToUserDeptDesc[x]);
  });
  return ret;
}
export const StringToUserDeptDesc: { [key in string]: string} = {
  "None": "미지정",
  "Admin": "슈퍼관리자",
  "CsoAdmin": "관리자",
  "Employee": "직원",
  "Quitter": "퇴사자",
  "TaxPayer": "사업자",
  "Personal": "개인",
  "Terminate": "계약종료",
}
