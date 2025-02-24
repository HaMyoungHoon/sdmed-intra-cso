import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {IPLogListComponent} from "./ip-log-list.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: IPLogListComponent}])],
  exports: [RouterModule]
})
export class IPLogListRoutingModule { }
