import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicineAddComponent} from "./medicine-add.component";
import {MedicineAddRoutingModule} from "./medicine-add-routing.module";
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
  declarations: [MedicineAddComponent],
  imports: [
    CommonModule, MedicineAddRoutingModule, AutoCompleteModule, Button, CardModule, DropdownModule, FormsModule, InputTextModule, PrimeTemplate, ProgressSpinComponent, TranslatePipe
  ]
})
export class MedicineAddModule { }
