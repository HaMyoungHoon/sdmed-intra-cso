import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {PharmaAddComponent} from "./pharma-add.component";
import {PharmaAddRoutingModule} from "./pharma-add-routing.module";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Select} from "primeng/select";
import {DatePicker} from "primeng/datepicker";



@NgModule({
  declarations: [PharmaAddComponent],
  imports: [
    CommonModule, PharmaAddRoutingModule, ButtonModule, CardModule, FormsModule, InputTextModule, ProgressSpinComponent, TranslatePipe, Select, DatePicker
  ]
})
export class PharmaAddModule { }
