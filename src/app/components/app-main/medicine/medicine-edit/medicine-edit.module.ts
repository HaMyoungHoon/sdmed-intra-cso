import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicineEditComponent} from "./medicine-edit.component";
import {MedicineEditRoutingModule} from "./medicine-edit-routing.module";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Select} from "primeng/select";



@NgModule({
  declarations: [MedicineEditComponent],
  imports: [
    CommonModule, MedicineEditRoutingModule, AutoCompleteModule, ButtonModule, CardModule, FormsModule, InputTextModule, ProgressSpinComponent, TranslatePipe, Select
  ]
})
export class MedicineEditModule { }
