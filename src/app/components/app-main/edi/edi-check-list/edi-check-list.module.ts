import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiCheckListComponent} from "./edi-check-list.component";
import {EdiCheckListRoutingModule} from "./edi-check-list-routing.module";
import {TableModule} from "primeng/table";
import {DatePicker} from "primeng/datepicker";
import {Select} from "primeng/select";
import {FormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {Tag} from "primeng/tag";
import {Button} from "primeng/button";
import {Ripple} from "primeng/ripple";



@NgModule({
  declarations: [EdiCheckListComponent],
  imports: [
    CommonModule, EdiCheckListRoutingModule, TableModule, DatePicker, Select, FormsModule, TranslatePipe, Tag, Button, Ripple
  ]
})
export class EdiCheckListModule { }
