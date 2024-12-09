import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {MedicineListComponent} from "./medicine-list.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: MedicineListComponent}])],
  exports: [RouterModule]
})
export class MedicineListRoutingModule { }
