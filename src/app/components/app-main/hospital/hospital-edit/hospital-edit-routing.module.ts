import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {HospitalEditComponent} from "./hospital-edit.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: HospitalEditComponent}])],
  exports: [RouterModule]
})
export class HospitalEditRoutingModule { }
