import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {UserMappingComponent} from "./user-mapping.component";



@NgModule({
  imports: [
    RouterModule.forChild([{path: "", component: UserMappingComponent}])
  ],
  exports: [RouterModule]
})
export class UserMappingRoutingModule { }
