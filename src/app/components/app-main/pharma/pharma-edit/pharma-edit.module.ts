import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {PharmaEditComponent} from "./pharma-edit.component";
import {PharmaEditRoutingModule} from "./pharma-edit-routing.module";
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {IconFieldModule} from "primeng/iconfield";
import {ImageModule} from "primeng/image";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PickListModule} from "primeng/picklist";
import {PrimeTemplate} from "primeng/api";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [PharmaEditComponent],
  imports: [
    CommonModule, PharmaEditRoutingModule, Button, CalendarModule, CardModule, CheckboxModule, DropdownModule, FormsModule, IconFieldModule, ImageModule, InputIconModule, InputTextModule, PickListModule, PrimeTemplate, ProgressSpinComponent, TranslatePipe
  ]
})
export class PharmaEditModule { }
