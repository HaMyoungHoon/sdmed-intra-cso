import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MainIngredientMethodComponent} from "./main-ingredient-method.component";
import {MainIngredientMethodRoutingModule} from "./main-ingredient-method-routing.module";



@NgModule({
  declarations: [MainIngredientMethodComponent],
  imports: [
    CommonModule, MainIngredientMethodRoutingModule
  ]
})
export class MainIngredientMethodModule { }
