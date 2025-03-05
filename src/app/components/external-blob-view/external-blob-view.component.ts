import {AfterViewInit, Component, Inject} from "@angular/core";
import Handsontable from "handsontable";
import {DOCUMENT} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {read, utils} from "xlsx";
import {Subject, takeUntil} from "rxjs";
import * as FConstants from "../../guards/f-constants";

@Component({
  selector: "app-external-blob-view",
  templateUrl: "./external-blob-view.component.html",
  styleUrl: "./external-blob-view.component.scss",
  standalone: false
})
export class ExternalBlobViewComponent implements AfterViewInit {
  blobUrl: string = "";
  ext: string = "";
  excelTable?: Handsontable;
  colHeader: string[] = [];
  isLoading: boolean = false;
  sub: Subject<any>[] = [];
  constructor(@Inject(DOCUMENT) private document: Document, private route: ActivatedRoute) {
    this.blobUrl = this.route.snapshot.queryParams["blobUrl"];
    this.validateUrl();
    this.parseExt();
  }
  subscribeRouter(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.route.queryParams.pipe(takeUntil(sub)).subscribe(async(x) => {
      this.blobUrl = x["blobUrl"];
      this.validateUrl();
      this.parseExt();
      await this.viewInit();
    });
  }
  async ngAfterViewInit(): Promise<void> {
    this.subscribeRouter();
  }
  async viewInit(): Promise<void> {
    if (this.isExcel) {
      await this.initExcel();
      await this.excelReady();
    }
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
  async excelReady(): Promise<void> {
    if (!this.isExcel) {
      return;
    }
    this.isLoading = true;
    const f = await fetch(this.blobUrl);
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

  get isPdf(): boolean {
    return this.ext == "pdf";
  }
  get isDoc(): boolean {
    return false
  }
  get isExcel(): boolean {
    return this.ext == "xls" || this.ext == "xlsx";
  }

  validateUrl(): void {
    if (this.blobUrl.startsWith(FConstants.BLOB_URL_1)) {
      return;
    }
    this.blobUrl = "";
  }
  parseExt(): void {
    if (this.blobUrl.length <= 0) {
      return;
    }
    const extIndex = this.blobUrl.lastIndexOf(".");
    if (extIndex < 0) {
      return;
    }
    this.ext = this.blobUrl.substring(extIndex + 1);
  }
}
