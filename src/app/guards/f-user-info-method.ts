import {RestResult} from "../models/common/rest-result";
import {UserDataModel} from "../models/rest/user/user-data-model";
import * as FExtensions from "./f-extensions";
import {UserInfoService} from "../services/rest/user-info.service";
import {CommonService} from "../services/rest/common.service";
import {AzureBlobService} from "../services/rest/azure-blob.service";
import {ElementRef} from "@angular/core";
import {FDialogService} from "../services/common/f-dialog.service";
import {stringArrayToUserRole, userRoleToFlag} from "../models/rest/user/user-role";
import {stringArrayToUserDept, userDeptToFlag} from "../models/rest/user/user-dept";
import {StatusDescToUserStatus} from "../models/rest/user/user-status";
import {UserFileType} from "../models/rest/user/user-file-type";
import {UserFileModel} from "../models/rest/user/user-file-model";

export async function imageSelected(event: any, data: UserDataModel, userFileType: UserFileType, service: UserInfoService, commonService: CommonService, azureBlobService: AzureBlobService): Promise<RestResult<UserFileModel>> {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const ext = await FExtensions.getFileExt(file);
    if (!FExtensions.isImage(ext)) {
      return new RestResult<UserFileModel>().setFail("only image file");
    }
    const blobStorageInfo = await commonService.getGenerateSas();
    if (blobStorageInfo.result != true || blobStorageInfo.data == undefined) {
      return new RestResult<UserFileModel>().setFail(blobStorageInfo.msg);
    }
    const blobModel = FExtensions.getUserBlobModel(data.id, file, blobStorageInfo.data, ext);
    await azureBlobService.putUpload(file, blobStorageInfo.data, blobModel.blobName, blobModel.mimeType);
    const ret = await service.putUserFileImageUrl(data.thisPK, blobModel, userFileType);
    if (ret.result) {
      return ret;
    }
    return new RestResult<UserFileModel>().setFail(ret.msg);
  }

  return new RestResult<UserFileModel>().setFail("only image file");
}

export function userImageView(fileModel: UserFileModel | undefined, input: ElementRef<HTMLInputElement>, fDialogService: FDialogService): void {
  if (fileModel) {
    input.nativeElement.click();
    return;
  }
  fDialogService.openFullscreenFileView({
    closable: false,
    closeOnEscape: true,
    draggable: true,
    resizable: true,
    maximizable: true,
    data: {
      file: FExtensions.userFileListToViewModel(Array<UserFileModel>(fileModel!!)),
      index: 0,
    }
  });
}
export async function saveUserData(data: UserDataModel, selectedUserRoles: string[], selectedUserDepts: string[], selectedUserStatus: string, service: UserInfoService): Promise<RestResult<UserDataModel>> {
  data.role = userRoleToFlag(stringArrayToUserRole(selectedUserRoles));
  data.dept = userDeptToFlag(stringArrayToUserDept(selectedUserDepts));
  data.status = StatusDescToUserStatus[selectedUserStatus];
  const ret = await service.putUser(data);
  if (ret.result) {
    const children = [...data.children];
    data = ret.data ?? new UserDataModel();
    data.children = children;
    return saveUserChildData(data, service);
  }

  return new RestResult<UserDataModel>().setFail(ret.msg);
}

export async function saveUserChildData(data: UserDataModel, service: UserInfoService): Promise<RestResult<UserDataModel>> {
  const ret = await service.postChildModify(data.thisPK, data.children.map(x => x.thisPK));
  return FExtensions.applyClass(RestResult<UserDataModel>, obj => {
    obj.result = ret.result;
    obj.code = ret.code;
    obj.data = data;
    obj.msg = ret.msg;
  });
}
