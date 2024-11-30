import { Component } from '@angular/core';
import {FComponentBase} from '../../../../../guards/f-component-base';
import {UserService} from '../../../../../services/rest/user.service';
import {UserDataModel} from '../../../../../models/rest/user-data-model';
import {HospitalModel} from '../../../../../models/rest/hospital-model';
import {PharmaModel} from '../../../../../models/rest/pharma-model';
import {MedicineModel} from '../../../../../models/rest/medicine-model';
import {FDialogService} from '../../../../../services/common/f-dialog.service';
import {UserRole, haveRole} from '../../../../../models/rest/user-role';
import {HospitalService} from '../../../../../services/rest/hospital.service';
import {PharmaService} from '../../../../../services/rest/pharma.service';

@Component({
  selector: 'app-user-mapping',
  templateUrl: './user-mapping.component.html',
  styleUrl: './user-mapping.component.scss'
})
export class UserMappingComponent extends FComponentBase {
  haveRole: boolean = false;
  userList: UserDataModel[] = [];
  hosList: HospitalModel[] = [];
  pharmaList: PharmaModel[] = [];
  medicineList: MedicineModel[] = [];
  selectUser?: UserDataModel;
  hosPickListUser?: UserDataModel;
  selectHos?: HospitalModel;
  selectPharma?: PharmaModel;
  constructor(private userService: UserService, private hospitalService: HospitalService, private pharmaService: PharmaService, private fDialogService: FDialogService) {
    super();
  }

  override ngInit(): void {
    this.userService.getMyRole().then(x => {
      if (x.result) {
        this.haveRole = haveRole(x.data, Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
        this.getAllList();
        return;
      }
      this.fDialogService.warn("ngInit", x.msg);
    }).catch(x => {
      this.fDialogService.error("ngInit", x.message);
    })
  }

  getAllList(): void {
    this.userService.getUserAll().then(x => {
      if (x.result) {
        this.userList = x.data ?? [];
        return;
      }
      this.fDialogService.warn("getAllList", x.msg);
    }).catch(x => {
      this.fDialogService.error("getAllList", x.message);
    });
    this.hospitalService.getHospitalAll().then(x => {
      if (x.result) {
        this.hosList = x.data ?? [];
        return;
      }
      this.fDialogService.warn("getAllList", x.msg);
    }).catch(x => {
      this.fDialogService.error("getAllList", x.message);
    });
    this.pharmaService.getPharmaAll().then(x => {
      if (x.result) {
        this.pharmaList = x.data ?? [];
        return;
      }
      this.fDialogService.warn("getAllList", x.msg);
    }).catch(x => {
      this.fDialogService.error("getAllList", x.message);
    });
  }
  userListOnSelect(): void {
    const buff = this.selectUser;
    if (buff == null) {
      return;
    }
    this.userService.getUserDataByPK(buff.thisPK, true, true, true).then(x => {
      if (x.result) {
        this.hosPickListUser = x.data;
        return;
      }
      this.fDialogService.warn("userSelect", x.msg);
    }).catch(x => {
      this.fDialogService.error("userSelect", x.message);
    })
  }

  get hosPickListDisable(): boolean {
    return this.hosPickListUser == null;
  }
  hosPickListTargetSelect(event: any): void {
    console.log(event);
  }
}
