import {Component, input} from "@angular/core";
import {UserDataModel} from "../../../../../models/rest/user/user-data-model";
import * as FExtensions from "../../../../../guards/f-extensions";
import {flagToRoleDesc} from "../../../../../models/rest/user/user-role";
import {flagToDeptDesc} from "../../../../../models/rest/user/user-dept";
import {statusToUserStatusDesc} from "../../../../../models/rest/user/user-status";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {MyInfoService} from "../../../../../services/rest/my-info.service";
import * as FAmhohwa from "../../../../../guards/f-amhohwa";
import * as FConstants from "../../../../../guards/f-constants";
import {transformToBoolean} from "primeng/utils";
import {Subject, takeUntil} from "rxjs";
import {UserFileType} from "../../../../../models/rest/user/user-file-type";
import {UserFileModel} from "../../../../../models/rest/user/user-file-model";

@Component({
  selector: "app-my-info",
  templateUrl: "./my-info.component.html",
  styleUrl: "./my-info.component.scss",
  standalone: false
})
export class MyInfoComponent extends FComponentBase {
  userDataModel?: UserDataModel = undefined;
  constructor(private thisService: MyInfoService) {
    super();
  }

  override async ngInit(): Promise<void> {
    await this.getData();
  }
  async getData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(true, true),
      e => this.fDialogService.error("getUserData", e));
    this.setLoading(false);
    if (ret.result) {
      this.userDataModel = ret.data;
      return;
    }

    this.fDialogService.warn("getUserData", ret.msg);
  }
  passwordChange(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openPasswordChangeDialog({
      modal: true,
      closable: true,
      closeOnEscape: true,
      draggable: false,
      resizable: false,
    }).pipe(takeUntil(sub)).subscribe((x): void => {
    });
  }
  logout(): void {
    FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
    this.router.navigate([`/`]).then();
  }

  childImage(child: UserDataModel, userFileType: UserFileType): string {
    const file = child.fileList.find(x => x.userFileType == userFileType);
    if (file) {
      return FExtensions.blobUrlThumbnail(file.blobUrl, file.mimeType);
    }
    return FConstants.ASSETS_NO_IMAGE;
  }
  childImageView(child: UserDataModel, userFileType: UserFileType): void {
    const file = child.fileList.find(x => x.userFileType == userFileType);
    if (file == null) {
      return;
    }
    this.fDialogService.openFullscreenFileView({
      closable: true,
      closeOnEscape: true,
      draggable: true,
      resizable: true,
      maximizable: true,
      data: {
        file: FExtensions.userFileListToViewModel(Array<UserFileModel>(file)),
        index: 0,
      }
    });
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionValue = ["0"];

  protected readonly getSeverity = FExtensions.getUserStatusSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
  protected readonly flagToDeptDesc = flagToDeptDesc;
  protected readonly dateToYearFullString = FExtensions.dateToYearFullString;
  protected readonly stringToDate = FExtensions.stringToDate;
  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly UserFileType = UserFileType;
}
