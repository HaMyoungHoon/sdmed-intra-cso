import {Vector2d} from "../models/common/vector-2d";
import * as FConstants from "./f-constants";
import {AddTextOptionModel} from "../models/common/add-text-option-model";
import {applyClass, getExtMimeType, isImage, pdfBlobAddText} from "./f-extensions";

export async function imageToCanvas(canvas: HTMLCanvasElement, image: HTMLImageElement, vector: Vector2d, angle: number = 0, rotate: Vector2d = new Vector2d()): Promise<Vector2d> {
  const context = canvas.getContext("2d");
  if (context) {
    if (vector.width != 0 && vector.height != 0) {
      image.width = vector.width;
      image.height = vector.height;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(angle * Math.PI / 180);
    const angleX = rotate.x * Math.PI / 180;
    const angleY = rotate.y * Math.PI / 180;
    context.transform(Math.cos(angleX), -Math.sin(angleY), -Math.sin(angleX), Math.cos(angleY), 0, 0);
    if (angle == 90 || angle == 270) {
      context.translate(-canvas.height / 2, -canvas.width / 2);
      context.drawImage(image, 0, 0, canvas.height, canvas.width);
    } else {
      context.translate(-canvas.width / 2, -canvas.height / 2);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
  }
  return (applyClass(Vector2d, obj => {
    obj.width = image.width;
    obj.height = image.height;
  }));
}
export async function blobToCanvas(canvas: HTMLCanvasElement, blob: Blob, vector: Vector2d, angle: number = 0, rotate: Vector2d = new Vector2d()): Promise<Vector2d> {
  const context = canvas.getContext("2d");
  const image = new Image();
  return new Promise((resolve, reject): void => {
    image.onload = (): void => {
      if (context) {
        if (vector.width != 0 && vector.height != 0) {
          image.width = vector.width;
          image.height = vector.height;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = image.width;
        canvas.height = image.height;
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(angle * Math.PI / 180);
        const angleX = rotate.x * Math.PI / 180;
        const angleY = rotate.y * Math.PI / 180;
        context.transform(Math.cos(angleX), -Math.sin(angleY), -Math.sin(angleX), Math.cos(angleY), 0, 0);
        if (angle == 90 || angle == 270) {
          context.translate(-canvas.height / 2, -canvas.width / 2);
          context.drawImage(image, 0, 0, canvas.height, canvas.width);
        } else {
          context.translate(-canvas.width / 2, -canvas.height / 2);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
        resolve(applyClass(Vector2d, obj => {
          obj.width = image.width;
          obj.height = image.height;
        }));
      }
      URL.revokeObjectURL(image.src);
    }
    image.src = URL.createObjectURL(blob);
  });
}
export async function cropToCanvas(canvas: HTMLCanvasElement, imageCanvas: HTMLCanvasElement, imageVector: Vector2d, cropVector: Vector2d): Promise<void> {
  const context = canvas.getContext("2d");
  if (context) {
    canvas.width = imageVector.width;
    canvas.height = imageVector.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = FConstants.FILL_CROP_ORIGIN_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.clearRect(cropVector.left, cropVector.top, cropVector.width, cropVector.height);
    context.drawImage(imageCanvas, cropVector.left, cropVector.top, cropVector.width, cropVector.height, cropVector.left, cropVector.top, cropVector.width, cropVector.height);
    context.strokeStyle = FConstants.FILL_CROP_BORDER_COLOR;
    let clientWidth = imageCanvas.clientWidth;
    if (clientWidth == 0) {
      clientWidth = imageCanvas.width;
    }
    const borderSize = FConstants.FILL_CROP_BORDER_WIDTH * imageCanvas.width / clientWidth;
    context.lineWidth = borderSize;
    context.strokeRect(cropVector.left - borderSize / 2, cropVector.top - borderSize / 2, cropVector.width + borderSize, cropVector.height + borderSize);
  }
}
export function clearCanvas(canvas: HTMLCanvasElement, vector: Vector2d) {
  const context = canvas.getContext("2d");
  if (context) {
    canvas.width = vector.width;
    canvas.height = vector.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
export function addBrushToCanvas(canvas: HTMLCanvasElement, previousDragVector: Vector2d | null, dragVector: Vector2d, addTextOptionModel: AddTextOptionModel): Vector2d {
  const context = canvas.getContext("2d");
  if (context) {
    context.globalCompositeOperation = "source-over";
    context.fillStyle = addTextOptionModel.textBackground;
    context.strokeStyle = addTextOptionModel.textBackground;
    context.lineWidth = addTextOptionModel.calcTextBackgroundHeight();
    context.lineCap = "round";
    if (previousDragVector != null) {
      if (previousDragVector.x == dragVector.x && previousDragVector.y == dragVector.y) {

      } else {
        context.beginPath();
        context.moveTo(addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, previousDragVector.x), addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, previousDragVector.y));
        context.lineTo(addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, dragVector.x), addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, dragVector.y));
        context.stroke();
      }
    }
//    context.fillRect(addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, dragVector.x), addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, dragVector.y), textWidth, addTextOptionModel.calcTextBackgroundHeight());
  }
  return applyClass(Vector2d, obj => {
    obj.x = dragVector.x;
    obj.y = dragVector.y;
  });
}
export function removeBrushToCanvas(canvas: HTMLCanvasElement, previousDragVector: Vector2d | null, dragVector: Vector2d, addTextOptionModel: AddTextOptionModel): Vector2d {
  const context = canvas.getContext("2d");
  if (context) {
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = addTextOptionModel.calcTextBackgroundHeight() * 1.5;
    context.lineCap = "square";
    if (previousDragVector != null) {
      context.beginPath();
      context.moveTo(addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, previousDragVector.x), addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, previousDragVector.y));
      context.lineTo(addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, dragVector.x), addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, dragVector.y));
      context.stroke();
    }
  }
  return applyClass(Vector2d, obj => {
    obj.x = dragVector.x;
    obj.y = dragVector.y;
  });
}
export function addSquareBuffToCanvas(canvas: HTMLCanvasElement, imageVector: Vector2d, dragVector: Vector2d, addTextOptionModel: AddTextOptionModel): void {
  const context = canvas.getContext("2d");
  if (context) {
    canvas.width = imageVector.width;
    canvas.height = imageVector.height;
    context.clearRect(0, 0, imageVector.width, imageVector.height);
    context.strokeStyle = addTextOptionModel.textBackground;
    context.lineWidth = addTextOptionModel.calcTextBackgroundHeight();
    context.lineCap = "square";
    context.beginPath();
    context.rect(addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, dragVector.x),
      addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, dragVector.y),
      addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, dragVector.width),
      addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, dragVector.height));
    context.stroke();
  }
}
export function addSquareToCanvas(canvas: HTMLCanvasElement, dragVector: Vector2d, addTextOptionModel: AddTextOptionModel): void {
  const context = canvas.getContext("2d");
  if (context) {
    context.strokeStyle = addTextOptionModel.textBackground;
    context.lineWidth = addTextOptionModel.calcTextBackgroundHeight();
    context.lineCap = "square";
    context.beginPath();
    context.rect(addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, dragVector.x),
      addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, dragVector.y),
      addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, dragVector.width),
      addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, dragVector.height));
    context.stroke();
  }
}
export function setSquareToCanvas(canvas: HTMLCanvasElement, imageVector: Vector2d, squareVector: Vector2d[], addTextOptionModel: AddTextOptionModel): void {
  const context = canvas.getContext("2d");
  if (context) {
    canvas.width = imageVector.width;
    canvas.height = imageVector.height;
    context.clearRect(0, 0, imageVector.width, imageVector.height);
    context.strokeStyle = addTextOptionModel.textBackground;
    context.lineWidth = addTextOptionModel.calcTextBackgroundHeight();
    context.lineCap = "square";
    squareVector.forEach(dragVector => {
      context.beginPath();
      context.rect(addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, dragVector.x),
        addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, dragVector.y),
        addTextOptionModel.calcBrushX(canvas.width, canvas.clientWidth, dragVector.width),
        addTextOptionModel.calcBrushY(canvas.height, canvas.clientHeight, dragVector.height));
      context.stroke();
    });
  }
}
export function textToCanvas(canvas: HTMLCanvasElement, text: string, vector: Vector2d, addTextOptionModel: AddTextOptionModel = new AddTextOptionModel()): Vector2d {
  const context = canvas.getContext("2d");
  let firstDragTextWidth = 0;
  if (context) {
    canvas.width = vector.width;
    canvas.height = vector.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = addTextOptionModel.calcImageFont();
    const textWidth = context.measureText(text).width;
    firstDragTextWidth = textWidth;
    context.fillStyle = addTextOptionModel.textBackground;
    context.fillRect(addTextOptionModel.calcImageTextX(canvas.width, canvas.clientWidth, textWidth), addTextOptionModel.calcTextBackgroundY(canvas.height, canvas.clientHeight), textWidth, addTextOptionModel.calcTextBackgroundHeight());
    context.fillStyle = addTextOptionModel.textColor;
    context.fillText(text, addTextOptionModel.calcImageTextX(canvas.width, canvas.clientWidth, textWidth), addTextOptionModel.calcImageTextY(canvas.height, canvas.clientHeight), canvas.width);
  }
  return applyClass(Vector2d, obj => {
    obj.x = addTextOptionModel.calcImageTextX(canvas.width, canvas.clientWidth, firstDragTextWidth);
    obj.y = addTextOptionModel.calcImageTextY(canvas.height, canvas.clientHeight);
  });
}
export function canvasTextUpdate(canvas: HTMLCanvasElement, text: string, addTextOptionModel: AddTextOptionModel = new AddTextOptionModel(), dragVector: Vector2d = new Vector2d()): Vector2d {
  const context = canvas.getContext("2d");
  let firstDragTextWidth = 0;
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const textEnter = text.split("\n");
    for (let i = 0; i < textEnter.length; i++) {
      context.font = addTextOptionModel.calcImageFont();
      const textWidth = context.measureText(textEnter[i]).width;
      if (i == 0) {
        firstDragTextWidth =  textWidth;
      }
      context.fillStyle = addTextOptionModel.textBackground;
      context.fillRect(addTextOptionModel.calcImageTextX(canvas.width, canvas.clientWidth, textWidth, dragVector.x), addTextOptionModel.calcTextBackgroundYLine(canvas.height, canvas.clientHeight, i, textEnter.length, dragVector.y), textWidth, addTextOptionModel.calcTextBackgroundHeight());
      context.fillStyle = addTextOptionModel.textColor;
      context.fillText(textEnter[i], addTextOptionModel.calcImageTextX(canvas.width, canvas.clientWidth, textWidth, dragVector.x), addTextOptionModel.calcImageTextYLine(canvas.height, canvas.clientHeight, i, textEnter.length, dragVector.y), canvas.width);
    }
  }
  return applyClass(Vector2d, obj => {
    obj.x = addTextOptionModel.calcImageTextX(canvas.width, canvas.clientWidth, firstDragTextWidth);
    obj.y = addTextOptionModel.calcImageTextY(canvas.height, canvas.clientHeight);
  });
}
export async function blobAddText(blob: Blob, text: string, mimeType: string = "image/jpeg", addTextOptionModel: AddTextOptionModel = new AddTextOptionModel()): Promise<Blob> {
  const ext = getExtMimeType(mimeType);
  if (ext == "pdf") {
    return await pdfBlobAddText(blob, text, mimeType, addTextOptionModel);
  }
  if (!isImage(ext)) {
    return blob;
  }
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      if (context) {
        canvas.width = image.width;
        canvas.height = image.height;
        context.clearRect(0, 0, canvas.width, canvas.height);
        // png 안보임
//        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        let fontSize = addTextOptionModel.fontSize;
        if (fontSize == 0) {
          fontSize = Math.max(image.width, image.height) / 40;
        }
        context.font = addTextOptionModel.calcImageFont(fontSize);
        const textWidth = context.measureText(text).width;
        context.fillStyle = addTextOptionModel.textBackground;
        context.fillRect(addTextOptionModel.calcImageTextX(canvas.width, canvas.clientWidth, textWidth), addTextOptionModel.calcTextBackgroundY(canvas.height, canvas.clientHeight, 0, fontSize), textWidth, addTextOptionModel.calcTextBackgroundHeight(fontSize));
        context.fillStyle = addTextOptionModel.textColor;
        context.fillText(text, addTextOptionModel.calcImageTextX(canvas.width, canvas.clientWidth, textWidth), addTextOptionModel.calcImageTextY(canvas.height, canvas.clientHeight, 0, fontSize), canvas.width);
        canvas.toBlob((blob) => resolve(blob!), mimeType);
        canvas.remove();
      } else {
        reject("이미지 초기화 실패");
      }
      URL.revokeObjectURL(image.src);
    };
    image.src = URL.createObjectURL(blob);
  });
}
export async function blobAddWatermarkCanvas(blob: Blob, text: string, mimeType: string = "image/jpeg", watermarkCanvas: HTMLCanvasElement): Promise<Blob> {
  const ext = getExtMimeType(mimeType);
  if (!isImage(ext)) {
    return blob;
  }
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      if (context) {
        canvas.width = image.width;
        canvas.height = image.height;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        context.drawImage(watermarkCanvas, 0, 0, canvas.width, canvas.height); // , 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob!), mimeType);
        canvas.remove();
      } else {
        reject("이미지 초기화 실패");
      }
      URL.revokeObjectURL(image.src);
    };
    image.src = URL.createObjectURL(blob);
  });
}
export function canvasCombined(imageCanvas: HTMLCanvasElement, brushCanvas: HTMLCanvasElement, squareCanvas: HTMLCanvasElement, watermarkCanvas: HTMLCanvasElement, cropVector: Vector2d): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = cropVector.width;
  canvas.height = cropVector.height;
  const context = canvas.getContext("2d");
  if (context) {
    context.drawImage(imageCanvas, cropVector.left, cropVector.top, cropVector.width, cropVector.height, 0, 0, cropVector.width, cropVector.height);
    context.drawImage(brushCanvas, cropVector.left, cropVector.top, cropVector.width, cropVector.height, 0, 0, cropVector.width, cropVector.height);
    context.drawImage(squareCanvas, cropVector.left, cropVector.top, cropVector.width, cropVector.height, 0, 0, cropVector.width, cropVector.height);
    context.drawImage(watermarkCanvas, cropVector.left, cropVector.top, cropVector.width, cropVector.height, 0, 0, cropVector.width, cropVector.height);
  }
  return canvas;
}
export async function canvasPrint(canvas: HTMLCanvasElement, alt: string = "", mimeType: string = "image/jpeg", height_width_full: number = 0): Promise<void> {
  const printWindow = window.open("", "print", "location=no, directories=no, status=no, toolbar=no, menubar=no, width=1020, height=650 left=0, top=0");
  if (printWindow) {
    const html = await fetch("assets/html/canvas-print.html");
    printWindow.document.write(await html.text());
    const heightAutoImage = printWindow.document.getElementById("heightAutoImage") as HTMLImageElement;
    const widthAutoImage = printWindow.document.getElementById("widthAutoImage") as HTMLImageElement;
    const fullImage = printWindow.document.getElementById("fullImage") as HTMLImageElement;
    if (height_width_full == 0) {
      heightAutoImage.src = canvas.toDataURL(mimeType);
      widthAutoImage.remove();
      fullImage.remove();
    } else if (height_width_full == 1) {
      heightAutoImage.remove();
      widthAutoImage.src = canvas.toDataURL(mimeType);
      fullImage.remove();
    } else {
      heightAutoImage.remove();
      widthAutoImage.remove();
      fullImage.src = canvas.toDataURL(mimeType);
    }
    printWindow.document.close();
    printWindow.focus();
    printWindow.setTimeout(function (): void {
      printWindow.print();
      printWindow.close();
    }, 2000);
  }
}
export async function toBlobCanvasCombined(imageCanvas: HTMLCanvasElement, brushCanvas: HTMLCanvasElement, squareCanvas: HTMLCanvasElement, watermarkCanvas: HTMLCanvasElement, mimeType: string = "image/jpeg", cropVector: Vector2d): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = cropVector.width;
  canvas.height = cropVector.height;
  const context = canvas.getContext("2d");
  return new Promise((resolve, reject): void => {
    if (context) {
      context.clearRect(0, 0, cropVector.width, cropVector.height);
//      context.fillStyle = FConstants.FILL_BACKGROUND_COLOR;
//      context.fillRect(0, 0, cropVector.width, cropVector.height);
      context.drawImage(imageCanvas, cropVector.left, cropVector.top, cropVector.width, cropVector.height, 0, 0, cropVector.width, cropVector.height);
      context.drawImage(brushCanvas, cropVector.left, cropVector.top, cropVector.width, cropVector.height, 0, 0, cropVector.width, cropVector.height);
      context.drawImage(squareCanvas, cropVector.left, cropVector.top, cropVector.width, cropVector.height, 0, 0, cropVector.width, cropVector.height);
      context.drawImage(watermarkCanvas, cropVector.left, cropVector.top, cropVector.width, cropVector.height, 0, 0, cropVector.width, cropVector.height);
      canvas.toBlob((blob) => {
        if (blob == null) {
          reject(blob);
        } else {
          resolve(blob);
        }
      }, mimeType);
      canvas.remove();
    }
  });
}
export function canvasSaveState(canvas: HTMLCanvasElement, canvasHistory: string[], canvasRedoStack: string[]): void {
  const historyBuff = canvas.toDataURL();
  canvasHistory.push(historyBuff);
  if (canvasHistory.length > 20) {
    canvasHistory.shift();
  }
  canvasRedoStack.splice(0);
}
export async function canvasRestoreState(canvas: HTMLCanvasElement, canvasState: string | undefined): Promise<void> {
  if (canvasState == undefined) {
    return;
  }

  const context = canvas.getContext("2d");
  const image = new Image();
  image.src = canvasState;
  image.onload = (): void => {
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
    }
  }
}
export async function undoCanvas(canvas: HTMLCanvasElement, canvasHistory: string[], redoStack: string[]): Promise<void> {
  if (canvasHistory.length > 0) {
    redoStack.push(canvas.toDataURL());
    const lastState = canvasHistory.pop();
    await canvasRestoreState(canvas, lastState);
  }
}
export async function redoCanvas(canvas: HTMLCanvasElement, canvasHistory: string[], redoStack: string[]): Promise<void> {
  if (redoStack.length > 0) {
    canvasHistory.push(canvas.toDataURL());
    const redoState = redoStack.pop();
    await canvasRestoreState(canvas, redoState);
  }
}
