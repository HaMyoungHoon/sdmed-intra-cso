import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {EdiCheckListComponent} from "./edi-check-list.component";



@NgModule({
  imports: [RouterModule.forChild([{path: "", component: EdiCheckListComponent}])],
  exports: [RouterModule]
})
export class EdiCheckListRoutingModule { }
