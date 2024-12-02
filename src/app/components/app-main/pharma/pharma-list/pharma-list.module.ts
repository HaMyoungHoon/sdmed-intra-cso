import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PharmaListComponent} from './pharma-list.component';
import {PharmaListRoutingModule} from './pharma-list-routing.module';



@NgModule({
  declarations: [PharmaListComponent],
  imports: [
    CommonModule, PharmaListRoutingModule
  ]
})
export class PharmaListModule { }
