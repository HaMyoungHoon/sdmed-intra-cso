import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {HospitalAddComponent} from "./hospital-add.component";
import {HospitalAddRoutingModule} from "./hospital-add-routing.module";
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [HospitalAddComponent],
  imports: [
    CommonModule, HospitalAddRoutingModule, Button, CalendarModule, CardModule, DropdownModule, FormsModule, InputTextModule, ProgressSpinComponent, TranslatePipe
  ]
})
export class HospitalAddModule { }
