import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {HospitalAddComponent} from "./hospital-add.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: HospitalAddComponent}])],
  exports: [RouterModule]
})
export class HospitalAddRoutingModule { }
