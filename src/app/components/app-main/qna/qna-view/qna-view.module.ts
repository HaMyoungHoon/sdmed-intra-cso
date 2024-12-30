import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {QnaViewComponent} from "./qna-view.component";
import {QnaListRoutingModule} from "../qna-list/qna-list-routing.module";



@NgModule({
  declarations: [QnaViewComponent],
  imports: [
    CommonModule, QnaListRoutingModule
  ]
})
export class QnaViewModule { }
