import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {LogListComponent} from "./log-list.component";
import {LogListRoutingModule} from "./log-list-routing.module";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";
import {TableModule} from "primeng/table";
import {Paginator} from "primeng/paginator";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [LogListComponent],
  imports: [
    CommonModule, LogListRoutingModule, ProgressSpinComponent, TableModule, Paginator, TranslatePipe
  ]
})
export class LogListModule { }
