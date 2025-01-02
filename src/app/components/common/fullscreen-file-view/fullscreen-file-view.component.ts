import {Component, Inject} from "@angular/core";
import {Drawer} from "primeng/drawer";
import * as FExtensions from "../../../guards/f-extensions";
import * as FConstants from "../../../guards/f-constants";
import {DOCUMENT, NgIf} from "@angular/common";
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import {read, utils} from "xlsx";
import {HotTableModule} from "@handsontable/angular";
import Handsontable from "handsontable";
import {Image} from "primeng/image";
import {FileViewModel} from "../../../models/rest/file-view-model";
import {Button} from "primeng/button";
import {ProgressSpinComponent} from "../progress-spin/progress-spin.component";

@Component({
  selector: "drawer-fullscreen-file-view",
  templateUrl: "./fullscreen-file-view.component.html",
  styleUrl: "./fullscreen-file-view.component.scss",
  standalone: true,
  imports: [Drawer, NgIf, NgxExtendedPdfViewerModule, HotTableModule, Image, Button, ProgressSpinComponent]
})
export class FullscreenFileViewComponent {
  isVisible: boolean = false;
  fileViewModel: FileViewModel[] = [];
  selectedIndex: number = -1;
  excelTable?: Handsontable;
  colHeader: string[] = [];
  isLoading: boolean = false;
  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  async show(fileViewModel: FileViewModel[], index: number = 0): Promise<void> {
    this.fileViewModel = fileViewModel;
    this.selectedIndex = index;
    this.isVisible = true;
    if (this.isExcel) {
      await this.excelReady();
    }
  }
  async hide(): Promise<void> {
    this.isVisible = false;
    await this.init();
  }
  async onHide(): Promise<void> {
    await this.init();
    console.log("onHide");
  }
  async init(): Promise<void> {
    this.fileViewModel = [];
    this.selectedIndex = -1;
    await this.initExcel();
    this.isLoading = false;
  }
  async initExcel(): Promise<void> {
    if (this.excelTable) {
      this.isLoading = true;
      this.excelTable.suspendRender();
      this.excelTable.clear();
      this.excelTable = undefined;
      this.isLoading = false;
    }
  }

  get prevAble(): boolean {
    return this.selectedIndex > 0;
  }
  get nextAble(): boolean {
    return this.selectedIndex < this.fileViewModel.length - 1;
  }
  async prev(): Promise<void> {
    if (this.isExcel) {
      await this.initExcel();
    }
    this.selectedIndex--;
    if (this.isExcel) {
      await this.excelReady();
    }
  }
  async next(): Promise<void> {
    if (this.isExcel) {
      await this.initExcel();
    }
    this.selectedIndex++;
    if (this.isExcel) {
      await this.excelReady();
    }
  }

  get selectViewModel(): FileViewModel | undefined {
    if (this.selectedIndex < 0 || this.selectedIndex >= this.fileViewModel.length) {
      return undefined;
    }
    return this.fileViewModel[this.selectedIndex];
  }
  get isImage(): boolean {
    const buff = this.selectViewModel;
    if (buff == null) {
      return false;
    }
    return FExtensions.isImage(buff.ext);
  }
  get isExcel(): boolean {
    const buff = this.selectViewModel;
    if (buff == null) {
      return false;
    }
    return buff.ext == "xlsx" || buff.ext == "xls";
  }
  get isPdf(): boolean {
    const buff = this.selectViewModel;
    if (buff == null) {
      return false;
    }
    return buff.ext == "pdf";
  }
  get isZip(): boolean {
    const buff = this.selectViewModel;
    if (buff == null) {
      return false;
    }
    return buff.ext == "zip";
  }
  get isDoc(): boolean {
    const buff = this.selectViewModel;
    if (buff == null) {
      return false;
    }
    return buff.ext == "docx" || buff.ext == "doc";
  }

  get getImageSrc(): string {
    const buff = this.selectViewModel;
    if (buff == null) {
      return FConstants.ASSETS_NO_IMAGE;
    }
    return buff.blobUrl;
  }
  get getPdfSrc(): string {
    const buff = this.selectViewModel;
    if (buff == null) {
      return FConstants.ASSETS_NO_IMAGE;
    }
    return buff.blobUrl;
  }
  get getZipSrc(): string {
    return FConstants.ASSETS_ZIP_IMAGE;
  }
  get getDocSrc(): string {
    return FConstants.ASSETS_DOCX_IMAGE;
  }

  get getFilename(): string {
    const buff = this.selectViewModel;
    if (buff == null) {
      return "???";
    }
    return buff.filename;
  }

  async excelReady(): Promise<void> {
    const buff = this.selectViewModel;
    if (buff == null) {
      return;
    }
    this.isLoading = true;
    const f = await fetch(buff.blobUrl);
    const ab = await f.arrayBuffer();
    const wb = read(ab);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const excelData: any[] = utils.sheet_to_json(ws, { defval: ""});
    this.colHeader = [...new Set(excelData.flatMap((x) => Object.keys(x)))];
    if (this.excelTable == null) {
      this.handsontableInit();
    }

    if (this.excelTable) {
      this.excelTable.clear();
      this.excelTable.suspendRender();
      this.excelTable.loadData(excelData);
      this.excelTable.resumeRender();
    }
    this.isLoading = false;
  }
  handsontableInit(): void {
    const container = this.document.getElementById("excelTable");
    if (container) {
      this.excelTable = new Handsontable(container, {
        rowHeaders: true,
        colHeaders: this.colHeader,
        height: "95%",
        width: "100%",
        autoWrapRow: true,
        autoWrapCol: false,
        autoColumnSize: {
          syncLimit: 5,
          useHeaders: true,
          samplingRatio: 5,
          allowSampleDuplicates: true
        },
        modifyColWidth: function(width:number, column: number ): number {
          if (width > 300) {
            return 300
          }
          return width
        },
        manualColumnResize: true,
        stretchH: "none",
        licenseKey: "non-commercial-and-evaluation"
      });
    }
  }
}
