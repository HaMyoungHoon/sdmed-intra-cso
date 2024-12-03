import {Component} from "@angular/core";
import {FComponentBase} from "../../../guards/f-component-base";
import {UserService} from '../../../services/rest/user.service';
import {FDialogService} from '../../../services/common/f-dialog.service';
import {UserRole} from '../../../models/rest/user-role';

@Component({
  selector: "app-dash-board",
  templateUrl: "./dash-board.component.html",
  styleUrl: "./dash-board.component.scss",
  standalone: false
})
export class DashBoardComponent extends FComponentBase {
  constructor(override userService: UserService, override fDialogService: FDialogService) {
    super(userService, fDialogService, Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
  }

  override async ngInit(): Promise<void> {
  }
}
