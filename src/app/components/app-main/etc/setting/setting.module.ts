import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {SettingComponent} from "./setting.component";
import {SettingRoutingModule} from "./setting-routing.module";
import {Checkbox} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {IftaLabel} from "primeng/iftalabel";
import {TranslatePipe} from "@ngx-translate/core";
import {InputText} from "primeng/inputtext";
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {IconField} from "primeng/iconfield";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {Select} from "primeng/select";
import {GoogleMapComponent} from "../../../common/google-map/google-map.component";



@NgModule({
  declarations: [SettingComponent],
  imports: [
    CommonModule, SettingRoutingModule, Checkbox, FormsModule, IftaLabel, TranslatePipe, InputText, Button, Card, IconField, ProgressSpinComponent, Select, GoogleMapComponent
  ]
})
export class SettingModule { }
