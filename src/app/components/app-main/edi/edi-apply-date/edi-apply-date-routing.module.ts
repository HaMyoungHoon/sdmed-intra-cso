import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {EdiApplyDateComponent} from "./edi-apply-date.component";



@NgModule({
  imports: [RouterModule.forChild([{path: "", component: EdiApplyDateComponent}])],
  exports: [RouterModule]
})
export class EdiApplyDateRoutingModule { }
