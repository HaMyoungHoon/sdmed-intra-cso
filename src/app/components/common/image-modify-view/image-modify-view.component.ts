import {Component, ElementRef, EventEmitter, HostListener, Inject, Output, ViewChild} from "@angular/core";
import {FileViewModel} from "../../../models/rest/file-view-model";
import {DOCUMENT, NgIf} from "@angular/common";
import * as FExtensions from "../../../guards/f-extensions";
import * as FCanvasUtil from "../../../guards/f-canvas-util";
import {Drawer} from "primeng/drawer";
import {Button} from "primeng/button";
import {ProgressSpinComponent} from "../progress-spin/progress-spin.component";
import {AddTextOptionModel} from "../../../models/common/add-text-option-model";
import {CommonService} from "../../../services/rest/common.service";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Textarea} from "primeng/textarea";
import {ColorPicker} from "primeng/colorpicker";
import {IftaLabel} from "primeng/iftalabel";
import {Select} from "primeng/select";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {Vector2d} from "../../../models/common/vector-2d";
import {ContextMenu} from "primeng/contextmenu";
import {MenuItem, MenuItemCommandEvent, PrimeTemplate} from "primeng/api";
import {HttpResponse} from "@angular/common/http";
import {Ripple} from "primeng/ripple";
import * as FImageCache from "../../../guards/f-image-cache";
import {allDesc, ImageDragMode} from "./image-drag-mode";
import {AppConfigService} from "../../../services/common/app-config.service";
import {PaintConfigModel} from "../../../models/common/paint-config-model";

@Component({
  selector: "drawer-image-modify-view",
  imports: [Drawer, Button, NgIf, ProgressSpinComponent, FormsModule, InputText, Textarea, ColorPicker, IftaLabel, Select, Tooltip, TranslatePipe, ContextMenu, PrimeTemplate, Ripple],
  templateUrl: "./image-modify-view.component.html",
  styleUrl: "./image-modify-view.component.scss",
  standalone: true,
})
export class ImageModifyViewComponent {
  @ViewChild("contentContainer") contentContainer!: ElementRef<HTMLDivElement>;
  @ViewChild("imageCanvas") imageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("cropCanvas") cropCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("brushCanvas") brushCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("squareCanvas") squareCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("squareCanvasBuff") squareCanvasBuff!: ElementRef<HTMLCanvasElement>;
  @ViewChild("watermarkCanvas") watermarkCanvas!: ElementRef<HTMLCanvasElement>;
  @Output() error: EventEmitter<{title: string, msg?: string}> = new EventEmitter();
  @Output() warn: EventEmitter<{title: string, msg?: string}> = new EventEmitter();
  isVisible: boolean = false;
  fileViewModel: FileViewModel[] = [];
  fileName: string = "";
  selectedIndex: number = 0;
  isComposing: boolean = false;
  isLoading: boolean = false;
  previousImageAngle: number = 0;
  imageAngle: number = 0;
  paintConfig: PaintConfigModel = new PaintConfigModel();
  imageVectorBuff: Vector2d = new Vector2d();
  imageVector: Vector2d = new Vector2d();
  rotateVector: Vector2d = new Vector2d();
  rotateIntervalX: any;
  rotateIntervalY: any;
  imageCropRightBuff: number = 0;
  imageCropBottomBuff: number = 0;
  imageCropVectorBuff: Vector2d = new Vector2d();
  imageCropVector: Vector2d = new Vector2d();
  imageDragMode: ImageDragMode = ImageDragMode.WATERMARK;
  imageDragList: ImageDragMode[] = allDesc();
  previousBrushVector: Vector2d | null = null;
  dragVector: Vector2d = new Vector2d();
  isBrushDrag: boolean = false;
  squareVector: Vector2d[] = [];
  squareRedoStack: Vector2d[] = [];
  isSquareDrag: boolean = false;
  watermarkVector: Vector2d = new Vector2d();
  isWatermarkDrag: boolean = false;
  brushHistory: string[] = [];
  brushRedoStack: string[] = [];
  contextMenu: MenuItem[] = [];
  constructor(@Inject(DOCUMENT) private document: Document, private commonService: CommonService, private appConfig: AppConfigService) {
    this.menuInit();
    this.paintConfig.textColor = this.appConfig.getTextColor();
    this.paintConfig.textBackColor = this.appConfig.getTextBackColor();
    this.paintConfig.brushAlpha = this.appConfig.getBrushAlpha();
    this.paintConfig.brushColor = this.appConfig.getBrushColor();
    this.paintConfig.squareAlpha = this.appConfig.getSquareAlpha();
    this.paintConfig.squareColor = this.appConfig.getSquareColor();
  }

  onError(title: string, msg?: string): void {
    this.error.next({title: title, msg: msg});
  }
  onWarn(title: string, msg?: string): void {
    this.warn.next({title: title, msg: msg});
  }
  async show(fileViewModel: FileViewModel[], fileName: string, addTextOptionModel: AddTextOptionModel = new AddTextOptionModel()): Promise<void> {
    this.fileViewModel = fileViewModel;
    this.fileName = fileName;
    this.isVisible = true;
    await this.imageReady();
    this.paintConfig.textSize = Math.max(this.imageVector.width, this.imageVector.height) / 40;
    this.paintConfig.brushSize = this.paintConfig.textSize / 2;
    this.paintConfig.squareSize = this.paintConfig.textSize / 10;
    await this.optionInput();
  }
  async hide(): Promise<void> {
    this.isVisible = false;
    await this.init();
  }
  async onHide(): Promise<void> {
    await this.init();
  }
  async init(): Promise<void> {
    this.fileViewModel = [];
    this.selectedIndex = 0;
    this.isLoading = false;
  }
  menuInit(): void {
    this.contextMenu = [
      {
        label: "common-desc.all-download",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.allDownload();
        }
      },
      {
        label: "common-desc.download",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.download();
        }
      },
      {
        separator: true
      },
      {
        label: "common-desc.height-auto-print",
        icon: "pi pi-print",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.print(0);
        }
      },
      {
        label: "common-desc.width-auto-print",
        icon: "pi pi-print",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.print(1);
        }
      },
      {
        label: "common-desc.full-print",
        icon: "pi pi-print",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.print(2);
        }
      }
    ];
  }
  async imageReady(): Promise<void> {
    const item: FileViewModel | undefined = this.selectViewModel;
    if (item == undefined) {
      return;
    }
    let blobBuff = await FImageCache.getImage(item.blobUrl);
    if (blobBuff == undefined) {
      this.isLoading = true;
      const ret: HttpResponse<Blob> | null = await FExtensions.tryCatchAsync(async(): Promise<HttpResponse<Blob>> => await this.commonService.downloadFile(item.blobUrl),
        e => this.onError("downloadFile", e));
      this.isLoading = false;
      if (ret && ret.body) {
        await FImageCache.putImage(item.blobUrl, ret.body);
        blobBuff = ret.body;
      } else {
        return;
      }
    }
    this.imageVector = await FCanvasUtil.blobToCanvas(this.imageCanvas.nativeElement, blobBuff, this.imageVector, this.imageAngle, this.rotateVector);
    this.imageVectorBuff.copy(this.imageVector);
    this.imageCropVector.copy(this.imageVector);
    this.dragVector.copy(this.imageVector);
    this.imageCropVectorBuff.copy(this.imageCropVector);
    this.imageCropRightBuff = this.imageVector.width - this.imageCropVector.right;
    this.imageCropBottomBuff = this.imageVector.height - this.imageCropVector.bottom;

    await FCanvasUtil.cropToCanvas(this.cropCanvas.nativeElement, this.imageCanvas.nativeElement, this.imageVector, this.imageCropVector);
    FCanvasUtil.textToCanvas(this.watermarkCanvas.nativeElement, this.fileName, this.imageVector, this.getTextOptionModel());
    FCanvasUtil.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.watermarkVector);
    FCanvasUtil.clearCanvas(this.brushCanvas.nativeElement, this.imageVector);
    FCanvasUtil.clearCanvas(this.squareCanvas.nativeElement, this.imageVector);
    FCanvasUtil.clearCanvas(this.squareCanvasBuff.nativeElement, this.imageVector);
    this.brushHistory = [];
  }
  get prevAble(): boolean {
    return this.selectedIndex > 0;
  }
  get nextAble(): boolean {
    return this.selectedIndex < this.fileViewModel.length - 1;
  }
  async prev(): Promise<void> {
    this.selectedIndex--;
    this.imageVector.init();
    this.rotateVector.init();
    this.previousImageAngle = 0
    this.imageAngle = 0
    await this.imageReady();
    this.paintConfig.textSize = Math.max(this.imageVector.width, this.imageVector.height) / 40;
    this.paintConfig.brushSize = this.paintConfig.textSize / 2;
    this.paintConfig.squareSize = this.paintConfig.textSize / 10;
    await this.optionInput();
  }
  async next(): Promise<void> {
    this.selectedIndex++;
    this.imageVector.init();
    this.rotateVector.init();
    this.previousImageAngle = 0
    this.imageAngle = 0
    await this.imageReady();
    this.paintConfig.textSize = Math.max(this.imageVector.width, this.imageVector.height) / 40;
    this.paintConfig.brushSize = this.paintConfig.textSize / 2;
    this.paintConfig.squareSize = this.paintConfig.textSize / 10;
    await this.optionInput();
  }
  close(): void {
    this.isVisible = false;
  }
  async allDownload(): Promise<void> {
    this.isLoading = true;
    for (const item of this.fileViewModel) {
      const ext = FExtensions.getExtMimeType(item.mimeType);
      if (FExtensions.isImage(ext)) {
        await this.downloadImageFile(item);
      } else {
        const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
          e => this.onError("downloadFile", e));
        try {
          if (ret && ret.body) {
            const filename: string = `${FExtensions.ableFilename(this.fileName)}.${FExtensions.getExtMimeType(item.mimeType)}`;
            FExtensions.fileSave(ret.body, filename);
          }
        } catch (e: any) {
          this.onError("download", e?.message?.toString());
        }
      }
    }
    this.isLoading = false;
  }
  async download(): Promise<void> {
    const item: FileViewModel | undefined = this.selectViewModel;
    if (item == undefined) {
      return;
    }
    this.isLoading = true;
    const blob: Blob = await FCanvasUtil.toBlobCanvasCombined(this.imageCanvas.nativeElement, this.brushCanvas.nativeElement, this.squareCanvas.nativeElement, this.watermarkCanvas.nativeElement, item.mimeType, this.imageCropVector);
    const filename: string = `${FExtensions.ableFilename(this.fileName)}.${FExtensions.getExtMimeType(item.mimeType)}`;
    FExtensions.fileSave(blob, filename);
    this.isLoading = false;
  }
  async downloadImageFile(item: FileViewModel): Promise<void> {
    let blobBuff = await FImageCache.getImage(item.blobUrl);
    if (blobBuff == undefined) {
      const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
        e => this.onError("downloadFile", e));
      if (ret && ret.body) {
        blobBuff = ret.body;
        await FImageCache.putImage(item.blobUrl, blobBuff);
      } else {
        this.onWarn("download", "edi file download fail");
        return;
      }
    }
    try {
      const filename: string = `${FExtensions.ableFilename(this.fileName)}.${FExtensions.getExtMimeType(item.mimeType)}`;
      const blob = await FCanvasUtil.blobAddWatermarkCanvas(blobBuff, filename, item.mimeType, this.watermarkCanvas.nativeElement);
      FExtensions.fileSave(blob, filename);
    } catch (e: any) {
      this.onError("download", e?.message?.toString());
    }
  }
  async print(height_width_full: number): Promise<void> {
    const item: FileViewModel | undefined = this.selectViewModel;
    if (item == undefined) {
      return;
    }
    this.isLoading = true;
    const canvas: HTMLCanvasElement = FCanvasUtil.canvasCombined(this.imageCanvas.nativeElement, this.brushCanvas.nativeElement, this.squareCanvas.nativeElement, this.watermarkCanvas.nativeElement, this.imageCropVector);
    await FCanvasUtil.canvasPrint(canvas, item.filename, item.mimeType, height_width_full);
    this.isLoading = false;
    canvas.remove();
  }
  clearBrushCanvas(): void {
    this.brushRedoStack = [];
    FCanvasUtil.clearCanvas(this.brushCanvas.nativeElement, this.imageVector);
  }
  clearSquareCanvas(): void {
    this.squareVector = [];
    this.squareRedoStack = [];
    FCanvasUtil.clearCanvas(this.squareCanvas.nativeElement, this.imageVector);
  }
  canvasDragStart(data: MouseEvent): void {
    if (data.button == 2 || data.button == 3) {
      return;
    }
    switch (this.imageDragMode) {
      case ImageDragMode.WATERMARK: this.watermarkDragStart(data); break;
      case ImageDragMode.BRUSH: this.brushCanvasDragStart(data); break;
      case ImageDragMode.BRUSH_REMOVE: this.brushCanvasDragStart(data); break;
      case ImageDragMode.SQUARE: this.squareCanvasDragStart(data); break;
    }
  }
  canvasDrag(data: MouseEvent): void {
    switch (this.imageDragMode) {
      case ImageDragMode.WATERMARK: this.watermarkDrag(data); break;
      case ImageDragMode.BRUSH: this.brushCanvasDrag(data); break;
      case ImageDragMode.BRUSH_REMOVE: this.brushCanvasDrag(data); break;
      case ImageDragMode.SQUARE: this.squareCanvasDrag(data); break;
    }
  }
  canvasDragEnd(): void {
    this.brushCanvasDragEnd();
    this.squareCanvasDragEnd();
    this.watermarkDragEnd();
  }
  brushCanvasDragStart(data: MouseEvent): void {
    if (!this.isBrushDrag) {
      this.isBrushDrag = true;
      this.previousBrushVector = null;
      FCanvasUtil.canvasSaveState(this.brushCanvas.nativeElement, this.brushHistory, this.brushRedoStack);
    }
  }
  brushCanvasDrag(data: MouseEvent): void {
    if (this.isBrushDrag) {
      this.dragVector.x = data.offsetX + 8
      this.dragVector.y = data.offsetY + 8
      if (this.imageDragMode == ImageDragMode.BRUSH) {
        this.previousBrushVector = FCanvasUtil.addBrushToCanvas(this.brushCanvas.nativeElement, this.previousBrushVector, this.dragVector, this.getBrushOptionModel());
      } else {
        this.previousBrushVector = FCanvasUtil.removeBrushToCanvas(this.brushCanvas.nativeElement, this.previousBrushVector, this.dragVector, this.getBrushOptionModel());
      }
    }
  }
  brushCanvasDragEnd(): void {
    if (this.isBrushDrag) {
      this.isBrushDrag = false;
    }
  }
  squareCanvasDragStart(data: MouseEvent): void {
    if (!this.isSquareDrag) {
      this.isSquareDrag = true;
      this.dragVector.x = data.offsetX;
      this.dragVector.y = data.offsetY;
      this.squareRedoStack = [];
    }
  }
  squareCanvasDrag(data: MouseEvent): void {
    if (this.isSquareDrag) {
      this.dragVector.right = data.offsetX;
      this.dragVector.bottom = data.offsetY;
      FCanvasUtil.addSquareBuffToCanvas(this.squareCanvasBuff.nativeElement, this.imageVector, this.dragVector, this.getSquareOptionModel());
    }
  }
  squareCanvasDragEnd(): void {
    if (this.isSquareDrag) {
      this.isSquareDrag = false;
      this.squareVector.push(this.dragVector.clone());
      FCanvasUtil.addSquareToCanvas(this.squareCanvas.nativeElement, this.dragVector, this.getSquareOptionModel());
      FCanvasUtil.clearCanvas(this.squareCanvasBuff.nativeElement, this.imageVector);
    }
  }
  watermarkDragStart(data: MouseEvent): void {
    if (!this.isWatermarkDrag) {
      this.isWatermarkDrag = true;
    }
  }
  watermarkDrag(data: MouseEvent): void {
    if (this.isWatermarkDrag) {
      this.watermarkVector.x = data.offsetX;
      this.watermarkVector.y = data.offsetY;
      FCanvasUtil.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.watermarkVector);
    }
  }
  watermarkDragEnd(): void {
    if (this.isWatermarkDrag) {
      this.isWatermarkDrag = false;
    }
  }
  optionInput(): void {
    if (!this.isComposing) {
      FCanvasUtil.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.watermarkVector);
    }
  }
  async onAngleChange(): Promise<void> {
    if (Math.abs(this.previousImageAngle - this.imageAngle) % 180 == 90) {
      this.imageVector.rotate();
    }
    this.previousImageAngle = this.imageAngle;
    await this.imageReady();
  }
  async angleChange(): Promise<void> {
    this.imageAngle += 90;
    if (this.imageAngle == 360) {
      this.imageAngle = 0;
    }
    console.log(`previousImageAngle ${this.previousImageAngle}`);
    console.log(`imageAngle ${this.imageAngle}`);
    console.log(`${Math.abs(this.previousImageAngle - this.imageAngle) % 180 == 90}`);
    if (Math.abs(this.previousImageAngle - this.imageAngle) % 180 == 90) {
      this.imageVector.rotate();
    }
    this.previousImageAngle = this.imageAngle;
    await this.imageReady();
  }
  async resizeKeydown(data: KeyboardEvent): Promise<void> {
    if (data.key == "Enter") {
      await this.resizeImage();
    }
  }
  async resizeImage(): Promise<void> {
    if (this.imageVectorBuff.width <= 0) {
      this.imageVectorBuff.width = this.imageVector.width;
    }
    if (this.imageVectorBuff.height <= 0) {
      this.imageVectorBuff.height = this.imageVector.height;
    }
    this.imageVector.copy(this.imageVectorBuff);
    await this.imageReady();
  }
  async cropKeydown(data: KeyboardEvent): Promise<void> {
    if (data.key == "Enter") {
      await this.cropImage();
    }
  }
  textBackColorChange(data: string): void {
    this.appConfig.setTextBackColor(data);
  }
  textColorChange(data: string): void {
    this.appConfig.setTextColor(data);
  }
  brushAlphaChange(data: number): void {
    if (data < 0 || data > 255) {
      this.paintConfig.brushAlpha = 255;
      return;
    }
    this.appConfig.setBrushAlpha(data);
  }
  brushColorChange(data: string): void {
    this.appConfig.setBrushColor(data);
  }
  squareAlphaChange(data: number): void {
    if (data < 0 || data > 255) {
      this.paintConfig.squareAlpha = 255;
      return;
    }
    this.appConfig.setSquareAlpha(data);
  }
  squareColorChange(data: string): void {
    this.appConfig.setSquareColor(data);
  }
  async cropImage(): Promise<void> {
    if (this.imageCropVectorBuff.left < 0) {
      this.imageCropVectorBuff.left = this.imageCropVector.left;
    }
    if (this.imageCropVectorBuff.top < 0) {
      this.imageCropVectorBuff.top = this.imageCropVector.top;
    }
    if (this.imageCropRightBuff < 0) {
      this.imageCropRightBuff = 0;
    }
    if (this.imageCropBottomBuff < 0) {
      this.imageCropBottomBuff = 0;
    }
    if (this.imageCropVectorBuff.left + this.imageCropRightBuff > this.imageVector.width) {
      this.imageCropVectorBuff.left = this.imageCropVector.left;
      this.imageCropRightBuff = this.imageVector.width - this.imageCropVector.right;
    }
    if (this.imageCropVectorBuff.top + this.imageCropBottomBuff > this.imageVector.height) {
      this.imageCropVectorBuff.top = this.imageCropVector.top;
      this.imageCropBottomBuff = this.imageVector.height - this.imageCropVector.bottom;
    }
    this.imageCropVectorBuff.right = this.imageVector.width - this.imageCropRightBuff;
    this.imageCropVectorBuff.bottom = this.imageVector.height - this.imageCropBottomBuff;
    this.imageCropVector.copy(this.imageCropVectorBuff);
    await FCanvasUtil.cropToCanvas(this.cropCanvas.nativeElement, this.imageCanvas.nativeElement, this.imageVector, this.imageCropVector)
    FCanvasUtil.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.watermarkVector);
  }
  async rotateXChange(positive: boolean): Promise<void> {
    this.rotateIntervalX = setInterval(async() => {
      if (positive) {
        this.rotateVector.x += 1;
        if (this.rotateVector.x >= 360) {
          this.rotateVector.x = 0;
        }
      } else {
        this.rotateVector.x -= 1;
        if (this.rotateVector.x <= -360) {
          this.rotateVector.x = 0;
        }
      }
      await this.imageReady();
    }, 20);
  }
  rotateXStop(): void {
    if (this.rotateIntervalX) {
      clearInterval(this.rotateIntervalX);
    }
  }
  async rotateYChange(positive: boolean): Promise<void> {
    this.rotateIntervalY = setInterval(async() => {
      if (positive) {
        this.rotateVector.y += 1;
        if (this.rotateVector.y >= 360) {
          this.rotateVector.y = 0;
        }
      } else {
        this.rotateVector.y -= 1;
        if (this.rotateVector.y <= -360) {
          this.rotateVector.y = 0;
        }
      }
      await this.imageReady();
    }, 20);
  }
  rotateYStop(): void {
    if (this.rotateIntervalY) {
      clearInterval(this.rotateIntervalY);
    }
  }
  async rotateKeydown(data: KeyboardEvent): Promise<void> {
    if (data.key == "Enter") {
      await this.imageReady();
    }
  }
  fileNameCompStart(): void {
    this.isComposing = true;
  }
  fileNameCompUpdate(data: CompositionEvent): void {
    const buff: string = (data.target as HTMLInputElement).value;
    FCanvasUtil.canvasTextUpdate(this.watermarkCanvas.nativeElement, buff, this.getTextOptionModel(), this.watermarkVector);
  }
  fileNameCompEnd(): void {
    this.isComposing = false;
    FCanvasUtil.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.watermarkVector);
  }

  get selectViewModel(): FileViewModel | undefined {
    if (this.selectedIndex < 0 || this.selectedIndex >= this.fileViewModel.length) {
      return undefined;
    }
    return this.fileViewModel[this.selectedIndex];
  }
  get isImage(): boolean {
    const buff: FileViewModel | undefined = this.selectViewModel;
    if (buff == null) {
      return false;
    }
    return FExtensions.isImage(buff.ext);
  }

  get backColorTooltip(): string {
    return "common-desc.back-color";
  }
  get textColorTooltip(): string {
    return "common-desc.text-color";
  }
  get brushColorTooltip(): string {
    return "common-desc.brush-color";
  }
  get brushClearTooltip(): string {
    return "common-desc.brush-clear";
  }
  get squareColorTooltip(): string {
    return "common-desc.square-color";
  }
  get squareClearTooltip(): string {
    return "common-desc.square-clear";
  }
  get imageDragTooltip(): string {
    return "shift 1,2,3,4";
  }
  get brushModeActive(): boolean {
    return this.imageDragMode == ImageDragMode.BRUSH || this.imageDragMode == ImageDragMode.BRUSH_REMOVE;
  }
  get squareModeActive(): boolean {
    return this.imageDragMode == ImageDragMode.SQUARE;
  }
  getBrushOptionModel(): AddTextOptionModel {
    if (this.paintConfig.brushAlpha <= 0) {
      this.paintConfig.brushAlpha = 1;
    }
    if (this.paintConfig.brushAlpha > 255) {
      this.paintConfig.brushAlpha = 255;
    }
    return FExtensions.applyClass(AddTextOptionModel, obj => {
      obj.fontSize = this.paintConfig.brushSize;
      obj.textBackground = FExtensions.hexColorWithAlpha(this.paintConfig.brushColor, this.paintConfig.brushAlpha);
    });
  }
  getSquareOptionModel(): AddTextOptionModel {
    if (this.paintConfig.squareAlpha <= 0) {
      this.paintConfig.squareAlpha = 1;
    }
    if (this.paintConfig.squareAlpha > 255) {
      this.paintConfig.squareAlpha = 255;
    }
    return FExtensions.applyClass(AddTextOptionModel, obj => {
      obj.fontSize = this.paintConfig.squareSize;
      obj.textBackground = FExtensions.hexColorWithAlpha(this.paintConfig.squareColor, this.paintConfig.squareAlpha);
    });
  }
  getTextOptionModel(): AddTextOptionModel {
    return FExtensions.applyClass(AddTextOptionModel, obj => {
      obj.fontSize = this.paintConfig.textSize;
      obj.textBackground = FExtensions.hexColorWithAlpha(this.paintConfig.textBackColor, 127);
      obj.textColor = FExtensions.hexColorWithAlpha(this.paintConfig.textColor, 255);
    });
  }
  async undoCanvas(): Promise<void> {
    if (this.brushModeActive) {
      await FCanvasUtil.undoCanvas(this.brushCanvas.nativeElement, this.brushHistory, this.brushRedoStack);
    }
    if (this.imageDragMode == ImageDragMode.SQUARE) {
      if (this.squareVector.length <= 0) {
        return;
      }
      const pop = this.squareVector.pop();
      if (pop) {
        this.squareRedoStack.push(pop);
        FCanvasUtil.setSquareToCanvas(this.squareCanvas.nativeElement, this.imageVector, this.squareVector, this.getSquareOptionModel());
      }
    }
  }
  async redoCanvas(): Promise<void> {
    if (this.squareModeActive) {
      await FCanvasUtil.redoCanvas(this.brushCanvas.nativeElement, this.brushHistory, this.brushRedoStack);
    }
    if (this.imageDragMode == ImageDragMode.SQUARE) {
      if (this.squareRedoStack.length <= 0) {
        return;
      }
      const pop = this.squareRedoStack.pop();
      if (pop) {
        this.squareVector.push(pop);
        FCanvasUtil.setSquareToCanvas(this.squareCanvas.nativeElement, this.imageVector, this.squareVector, this.getSquareOptionModel());
      }
    }
  }
  @HostListener("window:keydown", ["$event"])
  async handleKeydown(event: KeyboardEvent): Promise<void> {
    if (event.ctrlKey) {
      if (event.key.toLowerCase() == "z") {
        event.preventDefault();
        await this.undoCanvas();
      } else if (event.key.toLowerCase() == "y") {
        event.preventDefault();
        await this.redoCanvas();
      }
    } else if (event.shiftKey) {
      if (event.key == "!") {
        event.preventDefault();
        this.imageDragMode = this.imageDragList[0];
      } else if (event.key == "@") {
        event.preventDefault();
        this.imageDragMode = this.imageDragList[1];
      } else if (event.key == "#") {
        event.preventDefault();
        this.imageDragMode = this.imageDragList[2];
      } else if (event.key == "$") {
        event.preventDefault();
        this.imageDragMode = this.imageDragList[3];
      }
    }
  }
}
