import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {UserAddComponent} from "./user-add.component";
import {UserAddRoutingModule} from "./user-add-routing.module";
import {Button} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {MultiSelect} from "primeng/multiselect";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";
import {Select} from "primeng/select";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [UserAddComponent],
  imports: [
    CommonModule, UserAddRoutingModule, Button, FormsModule, IftaLabel, InputText, MultiSelect, ProgressSpinComponent, Select, TranslatePipe
  ]
})
export class UserAddModule { }
