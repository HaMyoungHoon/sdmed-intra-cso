import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {DashBoardComponent} from "./dash-board.component";
import {RequestViewComponent} from "./request-view/request-view.component";
import {ChartViewComponent} from "./chart-view/chart-view.component";
import {ButtonModule} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {SelectButtonModule} from "primeng/selectbutton";
import {Tooltip} from "primeng/tooltip";
import {FormsModule} from "@angular/forms";
import {ChartModule} from "primeng/chart";
import {ProgressSpinComponent} from "../../common/progress-spin/progress-spin.component";
import {DatePicker} from "primeng/datepicker";
import {Drawer} from "primeng/drawer";
import {RequestSubQnaComponent} from "./request-view/request-sub-qna/request-sub-qna.component";
import {Select} from "primeng/select";
import {RequestSubSignUpComponent} from "./request-view/request-sub-sign-up/request-sub-sign-up.component";
import {RequestSubEdiUploadComponent} from "./request-view/request-sub-edi-upload/request-sub-edi-upload.component";
import {Card} from "primeng/card";



@NgModule({
  imports: [RouterModule.forChild([{
    path: "",
    component: DashBoardComponent
  }]), ButtonModule, IconField, InputIcon, InputTextModule, TableModule, TagModule, TranslatePipe, NgIf, SelectButtonModule, Tooltip, FormsModule, ChartModule, ProgressSpinComponent, DatePicker, Drawer, NgSwitch, NgSwitchCase, RequestSubQnaComponent, Select, RequestSubSignUpComponent, RequestSubEdiUploadComponent, Card],
  declarations: [
    RequestViewComponent,
    ChartViewComponent,
  ],
  exports: [RouterModule, RequestViewComponent, ChartViewComponent]
})
export class DashBoardRoutingModule { }
