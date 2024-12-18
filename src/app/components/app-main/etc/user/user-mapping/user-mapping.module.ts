import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {UserMappingComponent} from "./user-mapping.component";
import {UserMappingRoutingModule} from "./user-mapping-routing.module";
import {ListboxModule} from "primeng/listbox";
import {FormsModule} from "@angular/forms";
import {PickListModule} from "primeng/picklist";
import {TranslatePipe} from "@ngx-translate/core";
import {ButtonModule} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {Chip} from "primeng/chip";
import {CheckboxModule} from "primeng/checkbox";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";
import {InputTextModule} from "primeng/inputtext";
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {CustomPickListComponent} from "../../../../common/custom-pick-list/custom-pick-list.component";



@NgModule({
  declarations: [UserMappingComponent],
	imports: [
		CommonModule, UserMappingRoutingModule, ListboxModule, FormsModule, PickListModule, TranslatePipe, ButtonModule, IconField, InputIcon, Chip, CheckboxModule, ProgressSpinComponent, InputTextModule, CdkDropListGroup, CdkDrag, CdkDropList, CustomPickListComponent
	]
})
export class UserMappingModule { }
