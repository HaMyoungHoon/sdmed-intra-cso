import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {HospitalListComponent} from "./hospital-list.component";



@NgModule({
  imports: [
    RouterModule.forChild([{path:"", component: HospitalListComponent}])
  ],
  exports: [RouterModule]
})
export class HospitalListRoutingModule { }
