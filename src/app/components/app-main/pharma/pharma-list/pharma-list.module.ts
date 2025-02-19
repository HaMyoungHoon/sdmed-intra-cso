import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {PharmaListComponent} from "./pharma-list.component";
import {PharmaListRoutingModule} from "./pharma-list-routing.module";
import {ButtonModule} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {TranslatePipe} from "@ngx-translate/core";
import {Tooltip} from "primeng/tooltip";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";



@NgModule({
  declarations: [PharmaListComponent],
	imports: [
		CommonModule, PharmaListRoutingModule, ButtonModule, IconField, InputIcon, InputTextModule, TableModule, TranslatePipe, Tooltip, ProgressSpinComponent
	]
})
export class PharmaListModule { }
