import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {PharmaEditComponent} from "./pharma-edit.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: PharmaEditComponent}])],
  exports: [RouterModule]
})
export class PharmaEditRoutingModule { }
