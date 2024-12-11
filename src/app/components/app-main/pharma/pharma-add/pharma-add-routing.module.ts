import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {PharmaAddComponent} from "./pharma-add.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: PharmaAddComponent}])],
  exports: [RouterModule]
})
export class PharmaAddRoutingModule { }
