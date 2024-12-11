import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {MedicineAddComponent} from "./medicine-add.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: MedicineAddComponent}])],
  exports: [RouterModule]
})
export class MedicineAddRoutingModule { }
