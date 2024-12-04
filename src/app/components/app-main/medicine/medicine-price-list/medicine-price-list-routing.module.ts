import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {MedicinePriceListComponent} from "./medicine-price-list.component";



@NgModule({
  imports: [
    RouterModule.forChild([{path:"", component: MedicinePriceListComponent}])
  ],
  exports: [RouterModule]
})
export class MedicinePriceListRoutingModule { }
