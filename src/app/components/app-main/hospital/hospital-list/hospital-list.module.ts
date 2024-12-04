import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {HospitalListComponent} from "./hospital-list.component";
import {HospitalListRoutingModule} from "./hospital-list-routing.module";
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {TooltipModule} from "primeng/tooltip";



@NgModule({
  declarations: [HospitalListComponent],
	imports: [
		CommonModule, HospitalListRoutingModule, Button, IconFieldModule, InputIconModule, InputTextModule, PrimeTemplate, TableModule, TagModule, TranslatePipe, TooltipModule
	]
})
export class HospitalListModule { }
