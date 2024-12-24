import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {EdiDueDateComponent} from "./edi-due-date.component";



@NgModule({
  imports: [RouterModule.forChild([{path: "", component: EdiDueDateComponent}])],
  exports: [RouterModule]
})
export class EdiDueDateRoutingModule { }
