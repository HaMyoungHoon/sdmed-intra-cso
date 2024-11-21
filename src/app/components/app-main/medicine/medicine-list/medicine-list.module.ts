import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicineListRoutingModule} from "./medicine-list-routing.module";
import {MedicineListComponent} from "./medicine-list.component";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {TagModule} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";



@NgModule({
  declarations: [MedicineListComponent],
  imports: [
    CommonModule, MedicineListRoutingModule, TableModule, Button, TagModule, TranslatePipe, IconFieldModule, InputIconModule, InputTextModule
  ]
})
export class MedicineListModule { }
