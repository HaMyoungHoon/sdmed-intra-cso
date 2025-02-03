import {TextPosition} from "./text-position";

export class AddTextOptionModel {
  fontSize: number = 0;
  textPosition: TextPosition = TextPosition.LT;
  correctionX: number = 10;
  correctionY: number = 10;
  paddingX: number = 20;
  paddingY: number = 5;
  // 둘 다 됨
  textBackground: string = "#FFFFFF7F"; // "rgba(255, 255, 255, 0.5)";
  textColor: string = "#000000FF"; // "rgba(0, 0, 0, 1)";

  calcPdfTextX(imageWidth: number, textWidth: number): number {
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.LB:
        return this.correctionX;
      case TextPosition.RT:
      case TextPosition.RB:
        return imageWidth - textWidth - this.correctionX - this.paddingX;
    }
    return this.correctionX;
  }
  calcPdfTextY(imageHeight: number): number {
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return imageHeight - this.correctionY - this.calcPdfFontSize();
      case TextPosition.LB:
      case TextPosition.RB:
        return this.correctionY + this.calcPdfFontSize();
    }
    return this.correctionY;
  }
  calcImageTextX(imageWidth: number, canvasWidth: number, textWidth: number, dragX: number = 0): number {
    if (canvasWidth == 0) {
      canvasWidth = imageWidth;
    }
    const scale = imageWidth / canvasWidth;
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.LB:
        return this.correctionX + (scale * dragX);
      case TextPosition.RT:
      case TextPosition.RB:
        return imageWidth - textWidth - this.correctionX + (scale * dragX);
    }
    return this.correctionX;
  }
  calcImageTextY(imageHeight: number, canvasHeight: number, dragY: number = 0): number {
    if (canvasHeight == 0) {
      canvasHeight = imageHeight;
    }
    const scale = imageHeight / canvasHeight;
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return this.correctionY + this.calcImageFontSize() + (scale * dragY);
      case TextPosition.LB:
      case TextPosition.RB:
        return imageHeight + this.correctionY - this.calcImageFontSize() - this.paddingY + (scale * dragY);
    }
    return this.correctionY;
  }
  calcImageTextYLine(imageHeight: number, canvasHeight: number, index: number, count: number, dragY: number): number {
    if (canvasHeight == 0) {
      canvasHeight = imageHeight;
    }
    const scale = imageHeight / canvasHeight;
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return this.correctionY + this.calcImageFontSize() + ((this.calcImageFontSize() + this.paddingY) * index) + (scale * dragY);
      case TextPosition.LB:
      case TextPosition.RB:
        return imageHeight + this.correctionY - this.calcImageFontSize() - this.paddingY - ((this.calcImageFontSize() + this.paddingY) * (count - index - 1)) + (scale * dragY);
    }
    return this.correctionY;
  }
  calcTextBackgroundY(imageHeight: number, canvasHeight: number, dragY: number = 0): number {
    if (canvasHeight == 0) {
      canvasHeight = imageHeight;
    }
    const scale = imageHeight / canvasHeight;
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return this.correctionY + (scale * dragY);
      case TextPosition.LB:
      case TextPosition.RB:
        return imageHeight - this.correctionY - this.calcImageFontSize() + this.paddingY + (scale * dragY);
    }
    return this.correctionY;
  }
  calcTextBackgroundYLine(imageHeight: number, canvasHeight: number, index: number, count: number, dragY: number = 0): number {
    if (canvasHeight == 0) {
      canvasHeight = imageHeight;
    }
    const scale = imageHeight / canvasHeight;
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return this.correctionY + ((this.calcImageFontSize() + this.paddingY) * index) + (scale * dragY);
      case TextPosition.LB:
      case TextPosition.RB:
        return imageHeight - this.correctionY - this.calcImageFontSize() + this.paddingY - ((imageHeight / this.calcImageFontSize() + this.paddingY) * (count - index - 1)) + (scale * dragY);
    }
    return this.correctionY;
  }
  calcTextBackgroundHeight(): number {
    return this.fontSize + this.paddingY;
  }
  calcImageFont(): string {
    return `${this.calcImageFontSize()}px sans-serif`;
  }
  calcImageFontSize(): number {
    return this.fontSize;
  }
  calcPdfFontSize(): number {
    return this.fontSize;
  }
}
