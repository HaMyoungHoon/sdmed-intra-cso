import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {DashBoardComponent} from "./dash-board.component";
import {DashBoardRoutingModule} from "./dash-board-routing.module";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {TranslatePipe} from "@ngx-translate/core";
import {InputTextModule} from "primeng/inputtext";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {TooltipModule} from "primeng/tooltip";
import {TagModule} from "primeng/tag";



@NgModule({
  declarations: [DashBoardComponent],
  imports: [
    CommonModule, DashBoardRoutingModule, TableModule, Button, IconFieldModule, InputIconModule, TranslatePipe, InputTextModule, SelectButtonModule, FormsModule, CalendarModule, TooltipModule, TagModule,
  ]
})
export class DashBoardModule { }
