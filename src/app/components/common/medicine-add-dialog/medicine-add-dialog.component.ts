import { Component } from "@angular/core";
import {FDialogComponentBase} from "../../../guards/f-dialog-component-base";
import {MedicineListService} from "../../../services/rest/medicine-list.service";
import {UserRole} from "../../../models/rest/user-role";

@Component({
  selector: "app-medicine-add-dialog",
  imports: [],
  templateUrl: "./medicine-add-dialog.component.html",
  styleUrl: "./medicine-add-dialog.component.scss",
  standalone: true,
})
export class MedicineAddDialogComponent extends FDialogComponentBase {
  constructor(private thisService: MedicineListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.MedicineChanger));
  }
}
