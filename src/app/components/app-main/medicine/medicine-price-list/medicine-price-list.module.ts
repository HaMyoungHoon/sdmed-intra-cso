import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicinePriceListRoutingModule} from "./medicine-price-list-routing.module";
import {MedicinePriceListComponent} from "./medicine-price-list.component";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {TagModule} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {Tooltip} from "primeng/tooltip";
import {FormsModule} from "@angular/forms";
import {DatePicker} from "primeng/datepicker";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {MultiSelect} from "primeng/multiselect";



@NgModule({
  declarations: [MedicinePriceListComponent],
	imports: [
		CommonModule, MedicinePriceListRoutingModule, TableModule, ButtonModule, TagModule, TranslatePipe, IconField, InputIcon, InputTextModule, Tooltip, FormsModule, DatePicker, ProgressSpinComponent, MultiSelect
	]
})
export class MedicinePriceListModule { }
