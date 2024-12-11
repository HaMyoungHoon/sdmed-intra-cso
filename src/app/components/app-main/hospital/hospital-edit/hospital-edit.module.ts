import { NgModule } from "@angular/core";
import {HospitalEditComponent} from "./hospital-edit.component";
import {CommonModule} from "@angular/common";
import {HospitalEditRoutingModule} from "./hospital-edit-routing.module";
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [HospitalEditComponent],
  imports: [
    CommonModule, HospitalEditRoutingModule, Button, CalendarModule, CardModule, DropdownModule, FormsModule, ImageModule, InputTextModule, ProgressSpinComponent, TranslatePipe
  ]
})
export class HospitalEditModule { }
