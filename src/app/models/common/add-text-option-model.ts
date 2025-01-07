import {TextPosition} from "./text-position";

export class AddTextOptionModel {
  fontSize: number = 12;
  textPosition: TextPosition = TextPosition.LT;
  correctionX: number = 10;
  correctionY: number = 10;
  paddingX: number = 20;
  paddingY: number = 5;
  imageBackground: string = "white";
  textColor: string = "black";

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
  calcImageTextX(imageWidth: number, textWidth: number): number {
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.LB:
        return this.correctionX;
      case TextPosition.RT:
      case TextPosition.RB:
        return imageWidth - textWidth - this.correctionX;
    }
    return this.correctionX;
  }
  calcImageTextY(imageHeight: number): number {
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return this.correctionY + this.calcImageFontSize();
      case TextPosition.LB:
      case TextPosition.RB:
        return imageHeight + this.correctionY + this.calcImageFontSize() - this.paddingY;
    }
    return this.correctionY;
  }
  calcCanvasY(imageHeight: number): number {
    return imageHeight + this.correctionY + this.calcImageFontSize() + this.paddingY;
  }
  calcImageY(): number {
    switch (this.textPosition) {
      case TextPosition.LT:
      case TextPosition.RT:
        return this.correctionY + this.calcImageFontSize() + this.paddingY;
      case TextPosition.LB:
      case TextPosition.RB:
        return 0;
    }
  }
  calcImageFont(): string {
    return `${this.calcImageFontSize()}px sans-serif`;
  }
  calcImageFontSize(): number {
    return this.fontSize * 2;
  }
  calcPdfFontSize(): number {
    return this.fontSize;
  }
}
