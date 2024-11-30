import {Component, ElementRef, ViewChild} from "@angular/core";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {UserService} from "../../../services/rest/user.service";
import {UserDataModel} from "../../../models/rest/user-data-model";
import {FDialogService} from "../../../services/common/f-dialog.service";
import {dateToYearFullString, stringToDate} from "../../../guards/f-extensions";
import {allUserRoleDescArray, flagToRoleDesc, haveRole, stringArrayToUserRole, UserRole} from "../../../models/rest/user-role";
import {allUserStatusDescArray, StatusDescToUserStatus, statusToUserStatusDesc, UserStatus,} from "../../../models/rest/user-status";
import {allUserDeptDescArray, flagToDeptDesc, stringArrayToUserDept} from "../../../models/rest/user-dept";
import {AccordionModule} from "primeng/accordion";
import {NgIf} from "@angular/common";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {TagModule} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {Button} from "primeng/button";
import {TableModule} from "primeng/table";
import {HospitalModel} from "../../../models/rest/hospital-model";
import {ImageModule} from "primeng/image";
import * as FConstants from "../../../guards/f-constants";

@Component({
  selector: "app-user-edit-dialog",
  standalone: true,
  imports: [AccordionModule, NgIf, ProgressSpinnerModule, TagModule, TranslatePipe, DropdownModule, FormsModule, MultiSelectModule, Button, TableModule, ImageModule],
  templateUrl: "./user-edit-dialog.component.html",
  styleUrl: "./user-edit-dialog.component.scss"
})
export class UserEditDialogComponent {
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
  loading: boolean;
  myRole?: number;
  haveRole: boolean;
  userDataModel?: UserDataModel;
  userRoleList: string[];
  userDeptList: string[];
  userStatusList: string[];
  selectedUserRoles: any;
  selectedUserDepts: any;
  selectedUserStatus: string = statusToUserStatusDesc(UserStatus.None);
  selectedHosData?: HospitalModel
  constructor(private ref: DynamicDialogRef, private dialogService: DialogService, private fDialogService: FDialogService, private userService: UserService) {
    this.loading = false;
    this.myRole = 0;
    this.haveRole = false;
    this.userRoleList = [];
    this.userDeptList = [];
    this.userStatusList = [];
    this.initLayoutData();
    const dlg = this.dialogService.getInstance(ref);
    this.getUserData(dlg.data);
  }

  initLayoutData(): void {
    this.userRoleList = allUserRoleDescArray();
    this.userDeptList = allUserDeptDescArray();
    this.userStatusList = allUserStatusDescArray();
  }
  getUserData(data: UserDataModel): void {
    this.loading = true;
    this.userService.getMyRole().then(x => {
      this.loading = false;
      if (x.result) {
        this.myRole = x.data;
        this.haveRole = haveRole(x.data, Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger))
        this.userService.getUserDataByPK(data.thisPK, true, true).then(x => {
          if (x.result) {
            this.userDataModel = x.data;
            console.log(this.userDataModel);
            this.selectedUserStatus = statusToUserStatusDesc(x.data?.status);
            this.selectedUserRoles = flagToRoleDesc(x.data?.role);
            this.selectedUserDepts = flagToDeptDesc(x.data?.dept);
            return;
          }
          this.fDialogService.warn("getUserData", x.msg);
        }).catch(x => {
          this.fDialogService.error("getUserData", x.message);
        });
        return;
      }
      this.fDialogService.warn("getUserData", x.msg);
    }).catch(x => {
      this.loading = false;
      this.fDialogService.error("getUserData", x.message);
    });
  }
  saveUserData(): void {
    const buff = this.userDataModel
    if (buff == null) {
      return;
    }

    const roles = stringArrayToUserRole(this.selectedUserRoles);
    const depts = stringArrayToUserDept(this.selectedUserDepts);
    const status = StatusDescToUserStatus[this.selectedUserStatus];
    this.loading = true;
    this.userService.putUserRoleDeptStatusModifyByPK(buff.thisPK, roles, depts, status).then(x => {
      this.loading = false;
      if (x.result) {
        this.ref.close(x.data);
        return;
      }
      this.fDialogService.warn("saveUserData", x.msg);
    }).catch(x => {
      this.loading = false;
      this.fDialogService.error("saveUserData", x.message);
    });
  }
  closeThis(): void {
    this.ref.close(this.userDataModel);
  }

  get taxpayerImageUrl(): string {
    if (this.userDataModel?.taxpayerImageUrl?.length ?? 0 > 0) {
      return this.userDataModel!!.taxpayerImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  taxpayerImageView(): void {
    const buff = this.userDataModel;
    if (buff == null) {
      return;
    }

    if (buff.taxpayerImageUrl.length <= 0) {
      this.taxpayerImageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      data: buff.taxpayerImageUrl
    });
  }
  taxpayerImageSelected(event: any): void {
    const buff = this.userDataModel;
    if (buff == null) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.loading = true;
      this.userService.putUserTaxImageUploadByPK(buff.thisPK, file).then(x => {
        this.loading = false;
        if (x.result) {
          this.userDataModel!!.taxpayerImageUrl = x.data?.taxpayerImageUrl ?? ""
          return;
        }

        this.fDialogService.warn("taxpayerImageView", x.msg);
      }).catch(x => {
        this.loading = false;
        this.fDialogService.error("taxpayerImageView", x.message);
      });
    }
  }
  get bankAccountImageUrl(): string {
    if (this.userDataModel?.bankAccountImageUrl?.length ?? 0 > 0) {
      return this.userDataModel!!.bankAccountImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  bankAccountImageView(): void {
    const buff = this.userDataModel;
    if (buff == null) {
      return;
    }

    if (buff.bankAccountImageUrl.length <= 0) {
      this.bankAccountImageInput.nativeElement.click();
      return;
    }

    this.fDialogService.openImageView({
      closable: false,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      data: buff.bankAccountImageUrl
    });
  }
  bankAccountImageSelected(event: any): void {
    const buff = this.userDataModel;
    if (buff == null) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.loading = true;
      this.userService.putUserBankImageUploadByPK(buff.thisPK, file).then(x => {
        this.loading = false;
        if (x.result) {
          this.userDataModel!!.bankAccountImageUrl = x.data?.bankAccountImageUrl ?? ""
          return;
        }

        this.fDialogService.warn("bankAccountImageView", x.msg);
      }).catch(x => {
        this.loading = false;
        this.fDialogService.error("bankAccountImageView", x.message);
      });
    }
  }

  hosListSelection(): void {

  }

  protected readonly stringToDate = stringToDate;
  protected readonly dateToYearFullString = dateToYearFullString;
}
