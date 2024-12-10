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
import {TagModule} from "primeng/tag";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {TooltipModule} from "primeng/tooltip";



@NgModule({
  declarations: [UserSettingComponent],
	imports: [
		CommonModule, UserSettingRoutingModule, TableModule, Button, TranslatePipe, DropdownModule, FormsModule, MultiSelectModule, TagModule, IconFieldModule, InputIconModule, InputTextModule, TooltipModule
	]
})
export class UserSettingModule { }
