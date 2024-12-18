import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MyInfoComponent} from "./my-info.component";
import {MyInfoRoutingModule} from "./my-info-routing.module";
import {AccordionModule} from "primeng/accordion";
import {TranslatePipe} from "@ngx-translate/core";
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ButtonModule} from "primeng/button";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";



@NgModule({
  declarations: [MyInfoComponent],
	imports: [
		CommonModule, MyInfoRoutingModule, AccordionModule, TranslatePipe, CardModule, TableModule, TagModule, ButtonModule, ProgressSpinComponent
	]
})
export class MyInfoModule { }
