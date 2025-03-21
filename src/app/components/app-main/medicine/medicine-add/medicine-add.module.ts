import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicineAddComponent} from "./medicine-add.component";
import {MedicineAddRoutingModule} from "./medicine-add-routing.module";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Select} from "primeng/select";
import {IftaLabel} from "primeng/iftalabel";



@NgModule({
  declarations: [MedicineAddComponent],
    imports: [
        CommonModule, MedicineAddRoutingModule, AutoCompleteModule, ButtonModule, CardModule, FormsModule, InputTextModule, ProgressSpinComponent, TranslatePipe, Select, IftaLabel
    ]
})
export class MedicineAddModule { }
