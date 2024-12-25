import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {RequestModel} from "../../../../../models/rest/requst/request-model";
import {UserRole} from "../../../../../models/rest/user/user-role";

@Component({
  selector: "app-request-sub-edi-upload",
  imports: [],
  templateUrl: "./request-sub-edi-upload.component.html",
  styleUrl: "./request-sub-edi-upload.component.scss",
  standalone: true,
})
export class RequestSubEdiUploadComponent extends FComponentBase {
  @Input() requestModel?: RequestModel
  @Output() closeEvent: EventEmitter<RequestModel> = new EventEmitter<RequestModel>();
  constructor() {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
  }

  override async ngInit(): Promise<void> {
  }
}
