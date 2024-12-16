import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicinePriceListRoutingModule} from "./medicine-price-list-routing.module";
import {MedicinePriceListComponent} from "./medicine-price-list.component";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {TagModule} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {TooltipModule} from "primeng/tooltip";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [MedicinePriceListComponent],
  imports: [
    CommonModule, MedicinePriceListRoutingModule, TableModule, Button, TagModule, TranslatePipe, IconFieldModule, InputIconModule, InputTextModule, TooltipModule, CalendarModule, FormsModule
  ]
})
export class MedicinePriceListModule { }
