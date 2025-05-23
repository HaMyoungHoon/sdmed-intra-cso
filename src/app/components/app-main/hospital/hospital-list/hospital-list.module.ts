import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {HospitalListComponent} from "./hospital-list.component";
import {HospitalListRoutingModule} from "./hospital-list-routing.module";
import {ButtonModule} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {Tooltip} from "primeng/tooltip";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {MultiSelect} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [HospitalListComponent],
  imports: [
    CommonModule, HospitalListRoutingModule, ButtonModule, IconField, InputIcon, InputTextModule, TableModule, TagModule, TranslatePipe, Tooltip, ProgressSpinComponent, MultiSelect, FormsModule
  ]
})
export class HospitalListModule { }
