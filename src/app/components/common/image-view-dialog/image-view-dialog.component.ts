import { Component } from "@angular/core";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ImageModule} from "primeng/image";
import * as FConstants from "../../../guards/f-constants";
import {Button} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {FDialogComponentBase} from '../../../guards/f-dialog-component-base';
import {UserService} from '../../../services/rest/user.service';
import {FDialogService} from '../../../services/common/f-dialog.service';

@Component({
  selector: "app-image-view-dialog",
  imports: [ImageModule, TranslatePipe, Button],
  templateUrl: "./image-view-dialog.component.html",
  styleUrl: "./image-view-dialog.component.scss",
  standalone: true,
})
export class ImageViewDialogComponent extends FDialogComponentBase {
  imageSrc: string;
  imageSize: number;
  minusHeightIntervalId: any = 0;
  plusHeightIntervalId: any = 0;
  constructor(override ref: DynamicDialogRef, override dialogService: DialogService, override userService: UserService, override fDialogService: FDialogService) {
    super(ref, dialogService, userService, fDialogService, Array());
    this.roleCheck = false;
    this.imageSize = 100;
    const dlg = this.dialogService.getInstance(ref);
    this.imageSrc = dlg.data ?? FConstants.ASSETS_NO_IMAGE;
  }

  minusHeightStart(): void {
    this.minusHeightIntervalId = setInterval(() => {
      if (this.imageSize <= 10) {
        return;
      }
      this.imageSize -= 5;
    }, 50);
  }
  minusHeightEnd(): void {
    clearInterval(this.minusHeightIntervalId);
  }
  plusHeightStart(): void {
    this.plusHeightIntervalId = setInterval(() => {
      if (this.imageSize >= 200) {
        return;
      }
      this.imageSize += 5;
    }, 50);
  }
  plusHeightEnd(): void {
    clearInterval(this.plusHeightIntervalId);
  }
  closeThis(): void {
    this.ref.close();
  }
  get imageHeight(): string {
    return `${this.imageSize}%`;
  }
}
