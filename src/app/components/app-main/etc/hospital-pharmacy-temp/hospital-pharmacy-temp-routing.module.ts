import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {HospitalPharmacyTempComponent} from "./hospital-pharmacy-temp.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: HospitalPharmacyTempComponent}])],
  exports: [RouterModule]
})
export class HospitalPharmacyTempRoutingModule { }
