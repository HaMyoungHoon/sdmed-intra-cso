import {Component} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserService} from '../../../../../services/rest/user.service';
import {FDialogService} from '../../../../../services/common/f-dialog.service';
import {UserRole} from '../../../../../models/rest/user-role';

@Component({
  selector: "app-main-ingredient-method",
  templateUrl: "./main-ingredient-method.component.html",
  styleUrl: "./main-ingredient-method.component.scss",
  standalone: false
})
export class MainIngredientMethodComponent extends FComponentBase {
  constructor(override userService: UserService, override fDialogService: FDialogService) {
    super(userService, fDialogService, Array<UserRole>(UserRole.None));
  }

  override async ngInit(): Promise<void> {
  }
}
