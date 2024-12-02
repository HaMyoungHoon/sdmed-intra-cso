import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {PharmaListComponent} from './pharma-list.component';



@NgModule({
  imports: [
    RouterModule.forChild([{path:"", component: PharmaListComponent}])
  ],
  exports: [RouterModule]
})
export class PharmaListRoutingModule { }
