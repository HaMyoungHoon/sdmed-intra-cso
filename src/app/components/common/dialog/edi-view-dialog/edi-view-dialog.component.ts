import {Component} from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {EdiListService} from "../../../../services/rest/edi-list.service";

@Component({
  selector: "app-edi-view-dialog",
  imports: [],
  templateUrl: "./edi-view-dialog.component.html",
  styleUrl: "./edi-view-dialog.component.scss",
  standalone: true,
})
export class EdiViewDialogComponent extends FDialogComponentBase {
  constructor(private thisService: EdiListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.EdiChanger));
  }

  override async ngInit(): Promise<void> {

  }
}
