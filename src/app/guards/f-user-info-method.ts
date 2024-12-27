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
import {getUserBlobModel} from "./f-extensions";

export async function bankAccountImageSelected(event: any, data: UserDataModel, service: UserInfoService, commonService: CommonService, azureBlobService: AzureBlobService): Promise<RestResult<UserDataModel>> {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const ext = await FExtensions.getFileExt(file);
    if (!FExtensions.isImage(ext)) {
      return new RestResult<UserDataModel>().setFail("only image file");
    }
    const blobModel = FExtensions.getUserBlobModel(data.id, file, ext);
    const sasKey = await commonService.getGenerateSas(blobModel.blobName);
    if (sasKey.result != true) {
      return new RestResult<UserDataModel>().setFail(sasKey.msg);
    }
    await azureBlobService.putUpload(file, blobModel.blobName, sasKey.data ?? "", blobModel.mimeType);
    const ret = await service.putUserBankImageUrl(data.thisPK, blobModel);
    if (ret.result) {
      return ret;
    }
    return new RestResult<UserDataModel>().setFail(ret.msg);
  }

  return new RestResult<UserDataModel>().setFail("only image file");
}

export async function taxpayerImageSelected(event: any, data: UserDataModel, service: UserInfoService, commonService: CommonService, azureBlobService: AzureBlobService): Promise<RestResult<UserDataModel>> {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const ext = await FExtensions.getFileExt(file);
    if (!FExtensions.isImage(ext)) {
      return new RestResult<UserDataModel>().setFail("only image file");
    }
    const blobModel = FExtensions.getUserBlobModel(data.id, file, ext);
    const sasKey = await commonService.getGenerateSas(blobModel.blobName);
    if (sasKey.result != true) {
      return new RestResult<UserDataModel>().setFail(sasKey.msg);
    }

    await azureBlobService.putUpload(file, blobModel.blobName, sasKey.data ?? "", blobModel.mimeType);
    const ret = await service.putUserTaxImageUrl(data.thisPK, blobModel)
    if (ret.result) {
      return ret;
    }
    return new RestResult<UserDataModel>().setFail(ret.msg);
  }
  return new RestResult<UserDataModel>().setFail("only image file");
}

export function userImageView(dataUrl: string, input: ElementRef<HTMLInputElement>, fDialogService: FDialogService): void {
  if (dataUrl.length <= 0) {
    input.nativeElement.click();
    return;
  }
  fDialogService.openImageView({
    closable: false,
    closeOnEscape: true,
    draggable: true,
    resizable: true,
    maximizable: true,
    data: Array<string>(dataUrl)
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
  console.log(data.children.map(x => x.thisPK));
  const ret = await service.postChildModify(data.thisPK, data.children.map(x => x.thisPK));
  if (ret.result) {
    return new RestResult<UserDataModel>(data);
  }

  return new RestResult<UserDataModel>().setFail(ret.msg);
}
