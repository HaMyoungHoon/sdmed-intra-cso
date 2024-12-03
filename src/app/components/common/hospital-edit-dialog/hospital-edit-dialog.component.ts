import {Component} from "@angular/core";
import {FDialogComponentBase} from '../../../guards/f-dialog-component-base';
import {UserRole} from '../../../models/rest/user-role';

@Component({
  selector: "app-hospital-edit-dialog",
  imports: [],
  templateUrl: "./hospital-edit-dialog.component.html",
  styleUrl: "./hospital-edit-dialog.component.scss",
  standalone: true
})
export class HospitalEditDialogComponent extends FDialogComponentBase {
  constructor() {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.HospitalChanger));
  }

  override async ngInit(): Promise<void> {

  }
}
