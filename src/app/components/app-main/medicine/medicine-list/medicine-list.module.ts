import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicineListComponent} from "./medicine-list.component";
import {MedicineListRoutingModule} from "./medicine-list-routing.module";
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [MedicineListComponent],
	imports: [
		CommonModule, MedicineListRoutingModule, Button, IconFieldModule, InputIconModule, InputTextModule, PrimeTemplate, TableModule, TooltipModule, TranslatePipe,
	]
})
export class MedicineListModule { }
