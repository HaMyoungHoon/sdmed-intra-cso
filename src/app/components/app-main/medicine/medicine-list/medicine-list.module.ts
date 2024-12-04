import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicineListComponent} from "./medicine-list.component";
import {MedicineListRoutingModule} from "./medicine-list-routing.module";



@NgModule({
  declarations: [MedicineListComponent],
  imports: [
    CommonModule, MedicineListRoutingModule,
  ]
})
export class MedicineListModule { }
