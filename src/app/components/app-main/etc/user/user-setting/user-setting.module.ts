import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {UserSettingComponent} from "./user-setting.component";
import {UserSettingRoutingModule} from "./user-setting-routing.module";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {TagModule} from "primeng/tag";



@NgModule({
  declarations: [UserSettingComponent],
  imports: [
    CommonModule, UserSettingRoutingModule, TableModule, Button, TranslatePipe, DropdownModule, FormsModule, MultiSelectModule, ProgressSpinnerModule, TagModule
  ]
})
export class UserSettingModule { }
