import {Component} from "@angular/core";
import {FComponentBase} from '../../../../guards/f-component-base';
import {UserService} from '../../../../services/rest/user.service';
import {FDialogService} from '../../../../services/common/f-dialog.service';
import {UserRole} from '../../../../models/rest/user-role';

@Component({
  selector: "app-pharma-list",
  standalone: false,
  templateUrl: "./pharma-list.component.html",
  styleUrl: "./pharma-list.component.scss",
})
export class PharmaListComponent extends FComponentBase {
  constructor(override userService: UserService, override fDialogService: FDialogService) {
    super(userService, fDialogService, Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.PharmaChanger));
  }

  override async ngInit(): Promise<void> {

  }
}
