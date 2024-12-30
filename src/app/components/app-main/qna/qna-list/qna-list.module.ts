import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {QnaListComponent} from "./qna-list.component";
import {QnaListRoutingModule} from "./qna-list-routing.module";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {TranslatePipe} from "@ngx-translate/core";
import {Tag} from "primeng/tag";
import {DatePicker} from "primeng/datepicker";
import {SelectButton} from "primeng/selectbutton";
import {Tooltip} from "primeng/tooltip";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";



@NgModule({
  declarations: [QnaListComponent],
  imports: [
    CommonModule, QnaListRoutingModule, TableModule, Button, IconField, InputIcon, TranslatePipe, Tag, DatePicker, SelectButton, Tooltip, FormsModule, InputText,
  ]
})
export class QnaListModule { }
