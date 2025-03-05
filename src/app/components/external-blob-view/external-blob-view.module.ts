import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {ExternalBlobViewComponent} from "./external-blob-view.component";
import {ExternalBlobViewRoutingModule} from "./external-blob-view-routing.module";
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import {Drawer} from "primeng/drawer";
import {ProgressSpinComponent} from "../common/progress-spin/progress-spin.component";



@NgModule({
  declarations: [ExternalBlobViewComponent],
  imports: [
    CommonModule, ExternalBlobViewRoutingModule, NgxExtendedPdfViewerModule, Drawer, ProgressSpinComponent
  ]
})
export class ExternalBlobViewModule { }
