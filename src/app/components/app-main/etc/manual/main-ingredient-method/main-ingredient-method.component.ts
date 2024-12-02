import { Component } from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";

@Component({
  selector: "app-main-ingredient-method",
  templateUrl: "./main-ingredient-method.component.html",
  styleUrl: "./main-ingredient-method.component.scss",
  standalone: false
})
export class MainIngredientMethodComponent extends FComponentBase {
  constructor() {
    super();
  }

  override ngInit(): void {
  }
}
