import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {NotfoundComponent} from "./notfound.component";
import {NotfoundRoutingModule} from "./notfound-routing.module";
import {Button} from "primeng/button";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [NotfoundComponent],
  imports: [
    CommonModule, NotfoundRoutingModule, Button, TranslatePipe
  ]
})
export class NotfoundModule { }
