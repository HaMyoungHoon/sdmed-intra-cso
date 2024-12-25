import { Component } from "@angular/core";
import {ImageModule} from "primeng/image";
import * as FConstants from "../../../../guards/f-constants";
import {ButtonModule} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";

@Component({
  selector: "app-image-view-dialog",
  imports: [ImageModule, TranslatePipe, ButtonModule],
  templateUrl: "./image-view-dialog.component.html",
  styleUrl: "./image-view-dialog.component.scss",
  standalone: true,
})
export class ImageViewDialogComponent extends FDialogComponentBase {
  imageSrc: string[];
  imageSize: number = 100;
  minusHeightIntervalId: any = 0;
  plusHeightIntervalId: any = 0;
  constructor() {
    super();
    this.roleCheck = false;
    const dlg = this.dialogService.getInstance(this.ref);
    this.imageSrc = dlg.data ?? Array<string>(FConstants.ASSETS_NO_IMAGE);
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
