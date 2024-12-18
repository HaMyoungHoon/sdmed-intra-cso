import { NgModule } from "@angular/core";
import {HospitalEditComponent} from "./hospital-edit.component";
import {CommonModule} from "@angular/common";
import {HospitalEditRoutingModule} from "./hospital-edit-routing.module";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Select} from "primeng/select";
import {DatePicker} from "primeng/datepicker";



@NgModule({
  declarations: [HospitalEditComponent],
	imports: [
		CommonModule, HospitalEditRoutingModule, ButtonModule, CardModule, FormsModule, ImageModule, InputTextModule, ProgressSpinComponent, TranslatePipe, Select, DatePicker
	]
})
export class HospitalEditModule { }
