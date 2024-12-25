import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserRole} from "../../../../../models/rest/user/user-role";
import {RequestModel} from "../../../../../models/rest/requst/request-model";

@Component({
  selector: "app-request-sub-qna",
  imports: [],
  templateUrl: "./request-sub-qna.component.html",
  styleUrl: "./request-sub-qna.component.scss",
  standalone: true,
})
export class RequestSubQnaComponent extends FComponentBase {
  @Input() requestModel?: RequestModel
  @Output() closeEvent: EventEmitter<RequestModel> = new EventEmitter<RequestModel>();
  constructor() {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
  }

  override async ngInit(): Promise<void> {
  }
}
