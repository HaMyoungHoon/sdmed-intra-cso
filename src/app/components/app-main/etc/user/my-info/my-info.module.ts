import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MyInfoComponent} from "./my-info.component";
import {MyInfoRoutingModule} from "./my-info-routing.module";
import {AccordionModule} from "primeng/accordion";
import {TranslatePipe} from "@ngx-translate/core";
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {Button} from "primeng/button";



@NgModule({
  declarations: [MyInfoComponent],
  imports: [
    CommonModule, MyInfoRoutingModule, AccordionModule, TranslatePipe, CardModule, TableModule, TagModule, ProgressSpinnerModule, Button
  ]
})
export class MyInfoModule { }
