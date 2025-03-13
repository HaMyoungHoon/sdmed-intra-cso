import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {HospitalPharmacyTempComponent} from "./hospital-pharmacy-temp.component";
import {HospitalPharmacyTempRoutingModule} from "./hospital-pharmacy-temp-routing.module";
import {Button} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {GoogleMapComponent} from "../../../common/google-map/google-map.component";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {Listbox} from "primeng/listbox";
import {PrimeTemplate} from "primeng/api";
import {ProgressSpinner} from "primeng/progressspinner";
import {TranslatePipe} from "@ngx-translate/core";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";



@NgModule({
  declarations: [HospitalPharmacyTempComponent],
  imports: [
    CommonModule, HospitalPharmacyTempRoutingModule, Button, FormsModule, GoogleMapComponent, IftaLabel, InputText, Listbox, PrimeTemplate, ProgressSpinner, TranslatePipe, ProgressSpinComponent
  ]
})
export class HospitalPharmacyTempModule { }
