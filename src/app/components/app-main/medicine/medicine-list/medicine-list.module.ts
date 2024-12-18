import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicineListComponent} from "./medicine-list.component";
import {MedicineListRoutingModule} from "./medicine-list-routing.module";
import {ButtonModule} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [MedicineListComponent],
	imports: [
		CommonModule, MedicineListRoutingModule, ButtonModule, IconField, InputIcon, InputTextModule, TableModule, Tooltip, TranslatePipe,
	]
})
export class MedicineListModule { }
