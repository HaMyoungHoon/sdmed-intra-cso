import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserMappingComponent} from './user-mapping.component';
import {UserMappingRoutingModule} from './user-mapping-routing.module';
import {ListboxModule} from "primeng/listbox";
import {FormsModule} from '@angular/forms';
import {PickListModule} from 'primeng/picklist';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from 'primeng/inputicon';
import {ChipsModule} from 'primeng/chips';
import {CheckboxModule} from 'primeng/checkbox';



@NgModule({
  declarations: [UserMappingComponent],
  imports: [
    CommonModule, UserMappingRoutingModule, ListboxModule, FormsModule, PickListModule, TranslatePipe, Button, IconFieldModule, InputIconModule, ChipsModule, CheckboxModule
  ]
})
export class UserMappingModule { }
