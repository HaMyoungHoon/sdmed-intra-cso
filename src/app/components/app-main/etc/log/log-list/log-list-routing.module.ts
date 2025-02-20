import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {LogListComponent} from "./log-list.component";



@NgModule({
  imports: [RouterModule.forChild([{path: "", component: LogListComponent}])],
  exports: [RouterModule]
})
export class LogListRoutingModule { }
