import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {UserEditComponent} from "./user-edit.component";
import {UserEditRoutingModule} from "./user-edit-routing.module";
import {AccordionModule} from "primeng/accordion";
import {Button} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {PrimeTemplate} from "primeng/api";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {PickListModule} from "primeng/picklist";



@NgModule({
  declarations: [UserEditComponent],
	imports: [
		CommonModule, UserEditRoutingModule, AccordionModule, Button, DropdownModule, ImageModule, InputTextModule, MultiSelectModule, PrimeTemplate, ProgressSpinComponent, ReactiveFormsModule, TableModule, TooltipModule, TranslatePipe, FormsModule, PickListModule
	]
})
export class UserEditModule { }
