import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiListComponent} from "./edi-list.component";
import {EdiListRoutingModule} from "./edi-list-routing.module";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {Tag} from "primeng/tag";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePicker} from "primeng/datepicker";
import {FormsModule} from "@angular/forms";
import {Checkbox} from "primeng/checkbox";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {MultiSelect} from "primeng/multiselect";



@NgModule({
  declarations: [EdiListComponent],
	imports: [
		CommonModule, EdiListRoutingModule, TableModule, Button, IconField, InputIcon, InputText, Tag, Tooltip, TranslatePipe, DatePicker, FormsModule, Checkbox, ProgressSpinComponent, MultiSelect
	]
})
export class EdiListModule { }
