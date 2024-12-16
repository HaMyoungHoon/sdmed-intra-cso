export enum UserDept {
  None = 0,
  Employee = 1,
  Quitter = Employee.valueOf() << 1,
  TaxPayer = Employee.valueOf() << 2,
  Personal = Employee.valueOf() << 3,
  Terminate = Employee.valueOf() << 4,
}

export function allUserDeptDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(UserDept).filter(x => isNaN(Number(x))).forEach(x => {
    ret.push(StringToUserDeptDesc[x]);
  });
  return ret;
}
export function stringArrayToUserDept(data: string[]): UserDept[] {
  if (data.length <= 0) {
    return [UserDept.None];
  }

  const ret: UserDept[] = [];
  data.forEach(x => {
    ret.push(UserDeptDescToUserDept[x]);
  });
  return ret;
}
export function flagToUserDept(flags?: number): UserDept[] {
  if (flags == null || flags == 0) {
    return [UserDept.None];
  }
  return Object.values(UserDept).filter((x) => {
    if (typeof x === "number") {
      return (flags & x) !== 0;
    }
    return false;
  }) as UserDept[];
}
export function userDeptToFlag(dept: UserDept[]): number {
  return dept.reduce((flag, x) => flag | x, 0);
}
export function userDeptToString(dept: UserDept[]): string[] {
  return dept.map((x) => UserDept[x]);
}
export function flagToDeptDesc(flags?: number): string[] {
  let ret: string[] = [];
  userDeptToString(flagToUserDept(flags)).forEach(x => {
    ret.push(StringToUserDeptDesc[x]);
  });
  return ret;
}
export const StringToUserDeptDesc: { [key in string]: string } = {
  "None": "미지정",
  "Employee": "직원",
  "Quitter": "퇴사자",
  "TaxPayer": "사업자",
  "Personal": "개인",
  "Terminate": "계약종료",
}
export const UserDeptDescToUserDept: { [key in string]: UserDept } = {
  "미지정": UserDept.None,
  "직원": UserDept.Employee,
  "퇴사자": UserDept.Quitter,
  "사업자": UserDept.TaxPayer,
  "개인": UserDept.Personal,
  "계약종료": UserDept.Terminate,
}
