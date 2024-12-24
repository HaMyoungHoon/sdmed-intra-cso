import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiApplyDateComponent} from "./edi-apply-date.component";
import {EdiApplyDateRoutingModule} from "./edi-apply-date-routing.module";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {Tag} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {Select} from "primeng/select";
import {FormsModule} from "@angular/forms";
import {DatePicker} from "primeng/datepicker";
import {Tooltip} from "primeng/tooltip";



@NgModule({
  declarations: [EdiApplyDateComponent],
  imports: [
    CommonModule, EdiApplyDateRoutingModule, TableModule, Button, IconField, InputIcon, InputText, Tag, TranslatePipe, Select, FormsModule, DatePicker, Tooltip
  ]
})
export class EdiApplyDateModule { }
