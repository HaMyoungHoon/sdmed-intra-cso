import {UserStatus} from "./user-status";
import {UserDataSubModel} from "./user-data-sub-model";

export interface UserDataModel {
  thisIndex: number;
  id: string;
  pw: string;
  name: string;
  mail: string;
  phoneNumber?: string;
  role: number;
  dept: number;
  status: UserStatus;
  regDate: Date;
  lastLoginDate?: Date;
  subData?: UserDataSubModel;
  children?: UserDataModel[];
}
