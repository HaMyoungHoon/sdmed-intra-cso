import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {MedicineEditComponent} from "./medicine-edit.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: MedicineEditComponent}])],
  exports: [RouterModule]
})
export class MedicineEditRoutingModule { }
