import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {PharmaListComponent} from "./pharma-list.component";
import {PharmaListRoutingModule} from "./pharma-list-routing.module";
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {TranslatePipe} from "@ngx-translate/core";
import {TooltipModule} from "primeng/tooltip";



@NgModule({
  declarations: [PharmaListComponent],
  imports: [
    CommonModule, PharmaListRoutingModule, Button, IconFieldModule, InputIconModule, InputTextModule, PrimeTemplate, TableModule, TranslatePipe, TooltipModule
  ]
})
export class PharmaListModule { }
