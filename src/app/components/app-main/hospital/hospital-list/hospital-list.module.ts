import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {HospitalListComponent} from "./hospital-list.component";
import {HospitalListRoutingModule} from "./hospital-list-routing.module";



@NgModule({
  declarations: [HospitalListComponent],
  imports: [
    CommonModule, HospitalListRoutingModule
  ]
})
export class HospitalListModule { }
