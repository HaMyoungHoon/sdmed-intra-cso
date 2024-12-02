import { Component } from "@angular/core";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ImageModule} from "primeng/image";
import * as FConstants from "../../../guards/f-constants";
import {Button} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: "app-image-view-dialog",
  imports: [ImageModule, TranslatePipe, Button],
  templateUrl: "./image-view-dialog.component.html",
  styleUrl: "./image-view-dialog.component.scss",
  standalone: true,
})
export class ImageViewDialogComponent {
  imageSrc: string;
  imageSize: number;
  minusHeightIntervalId: any = 0;
  plusHeightIntervalId: any = 0;
  constructor(private ref: DynamicDialogRef, private dialogService: DialogService) {
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
