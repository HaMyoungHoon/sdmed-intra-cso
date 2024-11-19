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
