import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiDueDateComponent} from "./edi-due-date.component";
import {EdiDueDateRoutingModule} from "./edi-due-date-routing.module";
import {FullCalendarModule} from "@fullcalendar/angular";
import {Drawer} from "primeng/drawer";
import {Listbox} from "primeng/listbox";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";



@NgModule({
  declarations: [EdiDueDateComponent],
  imports: [
    CommonModule, EdiDueDateRoutingModule, FullCalendarModule, Drawer, Listbox, FormsModule, Button, TranslatePipe, ProgressSpinComponent
  ]
})
export class EdiDueDateModule { }
