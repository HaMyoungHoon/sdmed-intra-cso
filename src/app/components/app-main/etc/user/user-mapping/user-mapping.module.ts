import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserMappingComponent} from './user-mapping.component';
import {UserMappingRoutingModule} from './user-mapping-routing.module';
import {ListboxModule} from "primeng/listbox";
import {FormsModule} from '@angular/forms';
import {PickListModule} from 'primeng/picklist';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';



@NgModule({
  declarations: [UserMappingComponent],
  imports: [
    CommonModule, UserMappingRoutingModule, ListboxModule, FormsModule, PickListModule, TranslatePipe, Button
  ]
})
export class UserMappingModule { }
