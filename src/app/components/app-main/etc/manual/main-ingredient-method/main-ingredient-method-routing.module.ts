import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {MainIngredientMethodComponent} from "./main-ingredient-method.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: MainIngredientMethodComponent}])
  ],
  exports: [RouterModule]
})
export class MainIngredientMethodRoutingModule { }
