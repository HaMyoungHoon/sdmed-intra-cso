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
import {debounceTime, Subject, Subscription} from 'rxjs';

@Component({
    selector: 'app-user-mapping',
    templateUrl: './user-mapping.component.html',
    styleUrl: './user-mapping.component.scss',
    standalone: false
})
export class UserMappingComponent extends FComponentBase {
  haveRole: boolean = false;
  userList: UserDataModel[] = [];
  selectUser?: UserDataModel;

  isHosSearchTypeCode: boolean = false;
  hosSearchValue: string = "";
  hosSearchLoading: boolean = false;
  hosSearchSubject: Subject<string> = new Subject<string>();
  hosSearchObserver?: Subscription;
  hosSearchDebounceTime: number = 1000;
  hosList: HospitalModel[] = [];
  hosPickListUser?: UserDataModel;
  selectHos?: HospitalModel;

  isPharmaSearchTypeCode: boolean = false;
  pharmaSearchValue: string = "";
  pharmaSearchLoading: boolean = false;
  pharmaSearchSubject: Subject<string> = new Subject<string>();
  pharmaSearchObserver?: Subscription;
  pharmaSearchDebounceTime: number = 1000;
  pharmaList: PharmaModel[] = [];
  selectPharma?: PharmaModel;

  medicineList: MedicineModel[] = [];

  isMobile: boolean = false;
  constructor(private userService: UserService, private hospitalService: HospitalService, private pharmaService: PharmaService, private fDialogService: FDialogService) {
    super();
  }

  override ngInit(): void {
    this.isMobile = !navigator.userAgent.includes("Window");
    this.userService.getMyRole().then(x => {
      if (x.result) {
        this.haveRole = haveRole(x.data, Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger));
        this.getAllList();
        return;
      }
      this.fDialogService.warn("ngInit", x.msg);
    }).catch(x => {
      this.fDialogService.error("ngInit", x.message);
    });
    this.initSearch();
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
  }
  initSearch(): void {
    this.hosSearchObserver = this.hosSearchSubject.pipe(debounceTime(this.hosSearchDebounceTime))
      .subscribe((x) => {
        this.hosSearchLoading = false;
        this.hosSearch();
    });
    this.pharmaSearchObserver = this.pharmaSearchSubject.pipe(debounceTime(this.pharmaSearchDebounceTime))
      .subscribe((x) => {
        this.pharmaSearchLoading = false;
        this.pharmaSearch();
      });
  }

  userListOnSelect(event: any): void {
    const buff = this.selectUser;
    if (buff == null) {
      this.hosPickListUser = undefined;
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

  get hosSearchStyle(): string {
    if (this.hosSearchLoading) return "pi pi-spinner pi-spin";
    else return "pi pi-search";
  }
  get hosSearchPlaceHolder(): string {
    if (this.isHosSearchTypeCode) return "user-mapping.hos-pick-list.search-code";
    else return "user-mapping.hos-pick-list.search-name";
  }
  hosSearchChange(data: any): void {
    if (this.isMobile) {
      this.hosSearchLoading = true;
      this.hosSearchSubject.next(data.data);
      return;
    }
    if (data.key == "Enter") {
      this.hosSearchLoading = true;
      this.hosSearchSubject.next(data.data);
    }
  }
  hosSearch(): void {
    if (this.hosSearchValue.length <= 0) {
      this.hosList = [];
      return;
    }
    this.hospitalService.getHospitalAllSearch(this.hosSearchValue, this.isHosSearchTypeCode).then(x => {
      if (x.result) {
        this.hosList = x.data ?? [];
        return;
      }
      this.fDialogService.warn("hosSearch", x.msg);
    }).catch(x => {
      this.fDialogService.error("hosSearch", x.message);
    });
  }
  get hosPickListDisable(): boolean {
    return this.hosPickListUser == null;
  }
  hosPickListTargetSelect(event: any): void {
    if (event.items.length > 1) {
      event.items.splice(0, event.items.length - 1);
    }
    if (event.items.length > 0) {
      this.selectHos = event.items[0];
    } else {
      this.selectHos = undefined;
    }
  }

  get pharmaSearchStyle(): string {
    if (this.pharmaSearchLoading) return "pi pi-spinner pi-spin";
    else return "pi pi-search";
  }
  get pharmaSearchPlaceHolder(): string {
    if (this.isPharmaSearchTypeCode) return "user-mapping.pharma-pick-list.search-code";
    else return "user-mapping.pharma-pick-list.search-name";
  }
  pharmaSearchChange(data: any): void {
    if (this.isMobile) {
      this.pharmaSearchLoading = true;
      this.pharmaSearchSubject.next(data.data);
      return;
    }
    if (data.key == "Enter") {
      this.pharmaSearchLoading = true;
      this.pharmaSearchSubject.next(data.data);
    }
  }
  pharmaSearch(): void {
    if (this.pharmaSearchValue.length <= 0) {
      this.pharmaList = [];
      return;
    }
    this.pharmaService.getPharmaAllSearch(this.pharmaSearchValue, this.isPharmaSearchTypeCode).then(x => {
      if (x.result) {
        this.pharmaList = x.data ?? [];
        return;
      }
      this.fDialogService.warn("pharmaSearch", x.msg);
    }).catch(x => {
      this.fDialogService.error("pharmaSearch", x.message);
    });
  }
  get pharmaPickListDisable(): boolean {
    return this.selectHos == null;
  }
  pharmaPickListTargetSelect(event: any): void {
    if (event.items.length > 1) {
      event.items.splice(0, event.items.length - 1);
    }
    if (event.items.length > 0) {
      this.selectPharma = event.items[0];
    } else {
      this.selectPharma = undefined;
    }
  }

  ellipsis(data: string): string {
    if (data.length > 20) {
      return data.substring(0, 20) + "...";
    }

    return data;
  }
}
