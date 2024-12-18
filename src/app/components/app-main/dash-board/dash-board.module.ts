import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {DashBoardComponent} from "./dash-board.component";
import {DashBoardRoutingModule} from "./dash-board-routing.module";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {TranslatePipe} from "@ngx-translate/core";
import {InputTextModule} from "primeng/inputtext";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {Tooltip} from "primeng/tooltip";
import {TagModule} from "primeng/tag";



@NgModule({
  declarations: [DashBoardComponent],
  imports: [
    CommonModule, DashBoardRoutingModule, TableModule, ButtonModule, IconField, InputIcon, TranslatePipe, InputTextModule, SelectButtonModule, FormsModule, Tooltip, TagModule,
  ]
})
export class DashBoardModule { }
