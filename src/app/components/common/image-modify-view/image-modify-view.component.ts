import {Component, ElementRef, Inject, ViewChild} from "@angular/core";
import {FileViewModel} from "../../../models/rest/file-view-model";
import {DOCUMENT, NgIf} from "@angular/common";
import * as FExtensions from "../../../guards/f-extensions";
import {Drawer} from "primeng/drawer";
import {Button} from "primeng/button";
import {ProgressSpinComponent} from "../progress-spin/progress-spin.component";
import {AddTextOptionModel} from "../../../models/common/add-text-option-model";
import {CommonService} from "../../../services/rest/common.service";
import {FDialogService} from "../../../services/common/f-dialog.service";
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
  @ViewChild("watermarkCanvas") watermarkCanvas!: ElementRef<HTMLCanvasElement>;
  isVisible: boolean = false;
  fileViewModel: FileViewModel[] = [];
  fileName: string = "";
  selectedIndex: number = 0;
  isComposing: boolean = false;
  isLoading: boolean = false;
  fontSize: number = 12;
  selectTextPosition: string = TextPositionToTextPositionDesc[TextPosition.LT];
  backColor: string = "#FFFFFF";
  textColor: string = "#000000";
  dragVector: Vector2d = new Vector2d();
  watermarkVector: Vector2d = new Vector2d();
  isDrag: boolean = false;
  contextMenu: MenuItem[] = [];
  constructor(@Inject(DOCUMENT) private document: Document, private commonService: CommonService, private fDialogService: FDialogService) {
    this.menuInit();
  }
  async show(fileViewModel: FileViewModel[], fileName: string, addTextOptionModel: AddTextOptionModel = new AddTextOptionModel()): Promise<void> {
    this.fileViewModel = fileViewModel;
    this.fileName = fileName;
    this.setAddTextOptionModel(addTextOptionModel);
    this.isVisible = true;
    await this.imageReady();
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
        label: "common-desc.save",
        icon: "pi pi-download",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.download();
        }
      },
      {
        label: "common-desc.print",
        icon: "pi pi-print",
        command: async(_: MenuItemCommandEvent): Promise<void> => {
          await this.print();
        }
      }
    ];
  }
  async imageReady(): Promise<void> {
    const item: FileViewModel | undefined = this.selectViewModel;
    if (item == undefined) {
      return;
    }
    this.isLoading = true;
    const ret: HttpResponse<Blob> | null = await FExtensions.tryCatchAsync(async(): Promise<HttpResponse<Blob>> => await this.commonService.downloadFile(item.blobUrl),
      e => this.fDialogService.error("downloadFile", e));
    if (ret && ret.body) {
      const vector: Vector2d = await FExtensions.blobToCanvas(this.imageCanvas.nativeElement, ret.body);
      this.watermarkVector = FExtensions.textToCanvas(this.watermarkCanvas.nativeElement, this.fileName, vector, this.getTextOptionModel())
    }
    this.isLoading = false;
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
    const blob: Blob = await FExtensions.toBlobCanvasCombined(this.imageCanvas.nativeElement, this.watermarkCanvas.nativeElement);
    const filename: string = `${FExtensions.ableFilename(this.fileName)}.${FExtensions.getMimeTypeExt(item.mimeType)}`;
    saveAs(blob, filename);
    this.isLoading = false;
  }
  async print(): Promise<void> {
    const item: FileViewModel | undefined = this.selectViewModel;
    if (item == undefined) {
      return;
    }
    this.isLoading = true;
    const canvas: HTMLCanvasElement = FExtensions.canvasCombined(this.imageCanvas.nativeElement, this.watermarkCanvas.nativeElement);
    await FExtensions.canvasPrint(canvas, item.filename, item.mimeType);
    this.isLoading = false;
    canvas.remove();
  }
  watermarkDragStart(data: MouseEvent): void {
    if (data.button == 2 || data.button == 3) {
      return;
    }
    this.isDrag = true;
    this.dragVector.x = data.offsetX - this.watermarkVector.x;
    this.dragVector.y = data.offsetY - this.watermarkVector.y;
  }
  watermarkDrag(data: MouseEvent): void {
    if (this.isDrag) {
      this.dragVector.x = data.offsetX - this.watermarkVector.x;
      this.dragVector.y = data.offsetY - this.watermarkVector.y;
      this.watermarkVector = FExtensions.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.dragVector);
    }
  }
  watermarkDragEnd(): void {
    this.isDrag = false;
  }
  onSelectChange(): void {
    this.dragVector.init();
    this.watermarkVector = FExtensions.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.dragVector);
  }
  optionInput(): void {
    if (!this.isComposing) {
      this.watermarkVector = FExtensions.canvasTextUpdate(this.watermarkCanvas.nativeElement, this.fileName, this.getTextOptionModel(), this.dragVector);
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
