import {Component} from "@angular/core";
import {FDialogComponentBase} from "../../../guards/f-dialog-component-base";
import {MedicineListService} from "../../../services/rest/medicine-list.service";
import {UserRole} from "../../../models/rest/user-role";

@Component({
  selector: "app-medicine-edit-dialog",
  imports: [],
  templateUrl: "./medicine-edit-dialog.component.html",
  styleUrl: "./medicine-edit-dialog.component.scss",
  standalone: true
})
export class MedicineEditDialogComponent extends FDialogComponentBase{
  constructor(private thisService: MedicineListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.MedicineChanger));
  }
}
