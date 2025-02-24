import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {IPLogListComponent} from "./ip-log-list.component";
import {IPLogListRoutingModule} from "./ip-log-list-routing.module";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";
import {TableModule} from "primeng/table";
import {Paginator} from "primeng/paginator";
import {TranslatePipe} from "@ngx-translate/core";
import {MultiSelect} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [IPLogListComponent],
  imports: [
    CommonModule, IPLogListRoutingModule, ProgressSpinComponent, TableModule, Paginator, TranslatePipe, MultiSelect, FormsModule
  ]
})
export class IPLogListModule { }
