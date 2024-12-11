import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {PharmaAddComponent} from "./pharma-add.component";
import {PharmaAddRoutingModule} from "./pharma-add-routing.module";
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [PharmaAddComponent],
  imports: [
    CommonModule, PharmaAddRoutingModule, Button, CalendarModule, CardModule, DropdownModule, FormsModule, InputTextModule, ProgressSpinComponent, TranslatePipe
  ]
})
export class PharmaAddModule { }
