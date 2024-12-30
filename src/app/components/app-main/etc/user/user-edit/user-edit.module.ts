import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {UserEditComponent} from "./user-edit.component";
import {UserEditRoutingModule} from "./user-edit-routing.module";
import {AccordionModule} from "primeng/accordion";
import {ButtonModule} from "primeng/button";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {Select} from "primeng/select";
import {CustomPickListComponent} from "../../../../common/custom-pick-list/custom-pick-list.component";
import {Card} from "primeng/card";



@NgModule({
  declarations: [UserEditComponent],
	imports: [
		CommonModule, UserEditRoutingModule, AccordionModule, ButtonModule, ImageModule, InputTextModule, MultiSelectModule, ProgressSpinComponent, ReactiveFormsModule, TableModule, Tooltip, TranslatePipe, FormsModule, Select, CustomPickListComponent, Card
	]
})
export class UserEditModule { }
