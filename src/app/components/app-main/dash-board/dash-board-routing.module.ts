import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {DashBoardComponent} from "./dash-board.component";
import {RequestViewComponent} from "./request-view/request-view.component";
import {ChartViewComponent} from "./chart-view/chart-view.component";
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {CalendarModule} from "primeng/calendar";
import {NgIf} from "@angular/common";
import {SelectButtonModule} from "primeng/selectbutton";
import {TooltipModule} from "primeng/tooltip";
import {FormsModule} from "@angular/forms";
import {ChartModule} from "primeng/chart";
import {ProgressSpinComponent} from "../../common/progress-spin/progress-spin.component";



@NgModule({
  imports: [RouterModule.forChild([{
    path: "",
    component: DashBoardComponent
  }]), Button, IconFieldModule, InputIconModule, InputTextModule, PrimeTemplate, TableModule, TagModule, TranslatePipe, CalendarModule, NgIf, SelectButtonModule, TooltipModule, FormsModule, ChartModule, ProgressSpinComponent],
  declarations: [
    RequestViewComponent,
    ChartViewComponent
  ],
  exports: [RouterModule, RequestViewComponent, ChartViewComponent]
})
export class DashBoardRoutingModule { }
