import {Component, ElementRef, EventEmitter, Inject, Output, ViewChild} from "@angular/core";
import {FileViewModel} from "../../../models/rest/file-view-model";
import {DOCUMENT, NgIf} from "@angular/common";
import * as FExtensions from "../../../guards/f-extensions";
import {Drawer} from "primeng/drawer";
import {Button} from "primeng/button";
import {ProgressSpinComponent} from "../progress-spin/progress-spin.component";
import {AddTextOptionModel} from "../../../models/common/add-text-option-model";
import {CommonService} from "../../../services/rest/common.service";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Textarea} from "primeng/textarea";
import {allTextPositionDesc, DescToTextPosition, TextPosition, TextPositionToTextPositionDesc} from "../../../models/common/text-position";
import {ColorPicker} from "primeng/colorpicker";
import {IftaLabel} from "primeng/iftalabel";
import {Select} from "primeng/select";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {Vector2d} from "../../../models/common/vector-2d";
import {saveAs} from "file-saver";
import {ContextMenu} from "primeng/contextmenu";
import {MenuItem, MenuItemCommandEvent, PrimeTemplate} from "primeng/api";
import {HttpResponse} from "@angular/common/http";
import {Ripple} from "primeng/ripple";

@Component({
  selector: "drawer-image-modify-view",
  imports: [Drawer, Button, NgIf, ProgressSpinComponent, FormsModule, InputText, Textarea, ColorPicker, IftaLabel, Select, Tooltip, TranslatePipe, ContextMenu, PrimeTemplate, Ripple],
  templateUrl: "./image-modify-view.component.html",
  styleUrl: "./image-modify-view.component.scss",
  standalone: true,
})
export class ImageModifyViewComponent {
  @ViewChild("imageCanvas") imageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("cropCanvas") cropCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("watermarkCanvas") watermarkCanvas!: ElementRef<HTMLCanvasElement>;
  @Output() error: EventEmitter<{title: string, msg: string}> = new EventEmitter<{title: string; msg: string}>();
  isVisible: boolean = false;
  fileViewModel: FileViewModel[] = [];
  fileName: string = "";
  selectedIndex: number = 0;
  isComposing: boolean = false;
  isLoading: boolean = false;
  fontSize: number = 0;
  previousImageAngle: number = 0;
  imageAngle: number = 0;
  selectTextPosition: string = TextPositionToTextPositionDesc[TextPosition.LT];
  backColor: string = "#FFFFFF";
  textColor: string = "#000000";
  imageVectorBuff: Vector2d = new Vector2d();
  imageVector: Vector2d = new Vector2d();
  rotateVector: Vector2d = new Vector2d();
  rotateIntervalX: any;
  rotateIntervalY: any;
  imageCropRightBuff: number = 0;
  imageCropBottomBuff: number = 0;
  imageCropVectorBuff: Vector2d = new Vector2d();
  imageCropVector: Vector2d = new Vector2d();
  dragVector: Vector2d = new Vector2d();
  isDrag: boolean = false;
  contextMenu: MenuItem[] = [];
  constructor(@Inject(DOCUMENT) private document: Document, private commonService: CommonService) {
    this.menuInit();
  }
  onError(title: string, msg: string): void {
    this.error.next({title: title, msg: msg});
  }
  async show(fileViewModel: FileViewModel[], fileName: string, addTextOptionModel: AddTextOptionModel = new AddTextOptionModel()): Promise<void> {
    this.fileViewModel = fileViewModel;
    this.fileName = fileName;
    this.setAddTextOptionModel(addTextOptionModel);
    this.isVisible = true;
    await this.imageReady();
    this.fontSize = Math.max(this.imageVector.width, this.imageVector.height) / 40;
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
    const ret: HttpResponse<Blob> | null = await FExtensions.tryCatchAsync(async(): Promise<HttpResponse<Blob>> => await this.commonService.downloadFile(item.blobUrl),
      e => this.onError("downloadFile", e));
    if (ret && ret.body) {
      this.imageVector = await FExtensions.blobToCanvas(this.imageCanvas.nativeElement, ret.body, this.imageVector, this.imageAngle, this.rotateVector);
      this.imageVectorBuff.copy(this.imageVector);
      this.imageCropVector.copy(this.imageVector);
      this.imageCropVectorBuff.copy(this.imageCropVector);
      this.imageCropRightBuff = this.imageVector.width - this.imageCropVector.right;
      this.imageCropBottomBuff = this.imageVector.height - this.imageCropVector.bottom;
      await FExtensions.cropToCanvas(this.cropCanvas.nativeElement, this.imageCanvas.nativeElement, this.imageVector, this.imageCropVector)
      FExtensions.textToCanvas(this.watermarkCanvas.nativeElement, this.fileName, this.imageVector, this.getTextOptionModel())
      FExtensions.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.dragVector);
    }
  }
  get prevAble(): boolean {
    return this.selectedIndex > 0;
  }
  get nextAble(): boolean {
    return this.selectedIndex < this.fileViewModel.length - 1;
  }
  async prev(): Promise<void> {
    this.selectedIndex--;
    await this.imageReady();
  }
  async next(): Promise<void> {
    this.selectedIndex++;
    await this.imageReady();
  }
  async download(): Promise<void> {
    const item: FileViewModel | undefined = this.selectViewModel;
    if (item == undefined) {
      return;
    }
    this.isLoading = true;
    const blob: Blob = await FExtensions.toBlobCanvasCombined(this.imageCanvas.nativeElement, this.watermarkCanvas.nativeElement, item.mimeType, this.imageCropVector);
    const filename: string = `${FExtensions.ableFilename(this.fileName)}.${FExtensions.getMimeTypeExt(item.mimeType)}`;
    saveAs(blob, filename);
    this.isLoading = false;
  }
  async print(height_width_full: number): Promise<void> {
    const item: FileViewModel | undefined = this.selectViewModel;
    if (item == undefined) {
      return;
    }
    this.isLoading = true;
    const canvas: HTMLCanvasElement = FExtensions.canvasCombined(this.imageCanvas.nativeElement, this.watermarkCanvas.nativeElement, this.imageCropVector);
    await FExtensions.canvasPrint(canvas, item.filename, item.mimeType, height_width_full);
    this.isLoading = false;
    canvas.remove();
  }
  watermarkDragStart(data: MouseEvent): void {
    if (data.button == 2 || data.button == 3) {
      return;
    }
    this.isDrag = true;
  }
  watermarkDrag(data: MouseEvent): void {
    if (this.isDrag) {
      this.dragVector.x = data.offsetX;
      this.dragVector.y = data.offsetY;
      FExtensions.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.dragVector);
    }
  }
  watermarkDragEnd(): void {
    this.isDrag = false;
  }
  onSelectChange(): void {
    this.dragVector.init();
    FExtensions.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.dragVector);
  }
  optionInput(): void {
    if (!this.isComposing) {
      FExtensions.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.dragVector);
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
    await FExtensions.cropToCanvas(this.cropCanvas.nativeElement, this.imageCanvas.nativeElement, this.imageVector, this.imageCropVector)
    FExtensions.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.dragVector);
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
    FExtensions.canvasTextUpdate(this.watermarkCanvas.nativeElement, buff, this.getTextOptionModel(), this.dragVector);
  }
  fileNameCompEnd(): void {
    this.isComposing = false;
    FExtensions.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.dragVector);
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

  get getFilename(): string {
    const buff: FileViewModel | undefined = this.selectViewModel;
    if (buff == null) {
      return "???";
    }
    return buff.filename;
  }
  get backColorTooltip(): string {
    return "common-desc.back-color";
  }
  get textColorTooltip(): string {
    return "common-desc.text-color";
  }
  getTextOptionModel(): AddTextOptionModel {
    return FExtensions.applyClass(AddTextOptionModel, obj => {
      obj.textPosition = DescToTextPosition[this.selectTextPosition];
      obj.fontSize = this.fontSize;
      obj.textBackground = FExtensions.hexColorWithAlpha(this.backColor, 127);
      obj.textColor = FExtensions.hexColorWithAlpha(this.textColor, 255);
    });
  }
  setAddTextOptionModel(addTextOptionModel: AddTextOptionModel): void {
    this.fontSize = addTextOptionModel.fontSize;
//    this.selectTextPosition = TextPositionToTextPositionDesc[addTextOptionModel.textPosition];
    this.backColor = FExtensions.hexColorWithoutAlpha(addTextOptionModel.textBackground);
    this.textColor = FExtensions.hexColorWithoutAlpha(addTextOptionModel.textColor);
  }

  protected readonly allTextPositionDesc = allTextPositionDesc;
}
