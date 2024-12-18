import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {UserSettingComponent} from "./user-setting.component";
import {UserSettingRoutingModule} from "./user-setting-routing.module";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {TagModule} from "primeng/tag";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {Tooltip} from "primeng/tooltip";



@NgModule({
  declarations: [UserSettingComponent],
	imports: [
		CommonModule, UserSettingRoutingModule, TableModule, ButtonModule, TranslatePipe, FormsModule, MultiSelectModule, TagModule, IconField, InputIcon, InputTextModule, Tooltip
	]
})
export class UserSettingModule { }
