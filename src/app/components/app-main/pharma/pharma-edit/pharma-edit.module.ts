import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {PharmaEditComponent} from "./pharma-edit.component";
import {PharmaEditRoutingModule} from "./pharma-edit-routing.module";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {IconField} from "primeng/iconfield";
import {ImageModule} from "primeng/image";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Select} from "primeng/select";
import {DatePicker} from "primeng/datepicker";
import {CustomPickListComponent} from "../../../common/custom-pick-list/custom-pick-list.component";



@NgModule({
  declarations: [PharmaEditComponent],
  imports: [
    CommonModule, PharmaEditRoutingModule, ButtonModule, CardModule, CheckboxModule, FormsModule, IconField, ImageModule, InputIcon, InputTextModule, ProgressSpinComponent, TranslatePipe, Select, DatePicker, CustomPickListComponent
  ]
})
export class PharmaEditModule { }
