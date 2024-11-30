import { Component } from "@angular/core";
import {FDialogService} from "../../../services/common/f-dialog.service";

@Component({
    selector: "app-f-dialog",
    imports: [],
    templateUrl: "./f-dialog.component.html",
    styleUrl: "./f-dialog.component.scss"
})
export class FDialogComponent {
  constructor(private fDialogService: FDialogService) {
  }
}
