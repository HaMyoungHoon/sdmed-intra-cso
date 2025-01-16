import {TextPosition} from "./text-position";

export class AddTextOptionModel {
  fontSize: number = 12;
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
  calcImageTextX(imageWidth: number, textWidth: number, dragX: number = 0): number {
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.LB:
        return this.correctionX + dragX;
      case TextPosition.RT:
      case TextPosition.RB:
        return imageWidth - textWidth - this.correctionX + dragX;
    }
    return this.correctionX;
  }
  calcImageTextY(imageHeight: number, dragY: number = 0): number {
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return this.correctionY + this.calcImageFontSize() + dragY;
      case TextPosition.LB:
      case TextPosition.RB:
        return imageHeight + this.correctionY - this.calcImageFontSize() - this.paddingY + dragY;
    }
    return this.correctionY;
  }
  calcImageTextYLine(imageHeight: number, index: number, count: number, dragY: number): number {
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return this.correctionY + this.calcImageFontSize() + ((this.calcImageFontSize() + this.paddingY) * index) + dragY;
      case TextPosition.LB:
      case TextPosition.RB:
        return imageHeight + this.correctionY - this.calcImageFontSize() - this.paddingY - ((this.calcImageFontSize() + this.paddingY) * (count - index - 1)) + dragY;
    }
    return this.correctionY;
  }
  calcTextBackgroundY(imageHeight: number, dragY: number = 0): number {
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return this.correctionY + dragY;
      case TextPosition.LB:
      case TextPosition.RB:
        return imageHeight - this.correctionY - this.calcImageFontSize() + this.paddingY + dragY;
    }
    return this.correctionY;
  }
  calcTextBackgroundYLine(imageHeight: number, index: number, count: number, dragY: number = 0): number {
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return this.correctionY + ((this.calcImageFontSize() + this.paddingY) * index) + dragY;
      case TextPosition.LB:
      case TextPosition.RB:
        return imageHeight - this.correctionY - this.calcImageFontSize() + this.paddingY - ((this.calcImageFontSize() + this.paddingY) * (count - index - 1)) + dragY;
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
