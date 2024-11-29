import { Component } from '@angular/core';
import {FComponentBase} from '../../../../../guards/f-component-base';
import {UserService} from '../../../../../services/rest/user.service';
import {DialogService} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-user-mapping',
  templateUrl: './user-mapping.component.html',
  styleUrl: './user-mapping.component.scss'
})
export class UserMappingComponent extends FComponentBase {
  constructor(private userService: UserService, private fDialogService: DialogService) {
    super();
  }

  override ngInit(): void {
  }
}
