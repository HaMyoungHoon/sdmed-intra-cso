import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {UserSettingComponent} from "./user-setting.component";



@NgModule({
  imports: [
    RouterModule.forChild([{path: "", component: UserSettingComponent}])
  ],
  exports: [RouterModule]
})
export class UserSettingRoutingModule { }
