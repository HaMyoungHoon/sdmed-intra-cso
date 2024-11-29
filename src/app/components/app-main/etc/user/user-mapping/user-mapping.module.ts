import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserMappingComponent} from './user-mapping.component';
import {UserMappingRoutingModule} from './user-mapping-routing.module';



@NgModule({
  declarations: [UserMappingComponent],
  imports: [
    CommonModule, UserMappingRoutingModule
  ]
})
export class UserMappingModule { }
