import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicineEditComponent} from "./medicine-edit.component";
import {MedicineEditRoutingModule} from "./medicine-edit-routing.module";
import {AutoCompleteModule} from "primeng/autocomplete";
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [MedicineEditComponent],
  imports: [
    CommonModule, MedicineEditRoutingModule, AutoCompleteModule, Button, CardModule, DropdownModule, FormsModule, InputTextModule, PrimeTemplate, ProgressSpinComponent, TranslatePipe
  ]
})
export class MedicineEditModule { }
