import {QnAState} from "./qna-state";

export class QnAHeaderModel {
  thisPK: string = "";
  userPK: string = "";
  id: string = "";
  title: string = "";
  regDate: Date = new Date();
  qnaState: QnAState = QnAState.None;

  copyLhsFromRhs(lhs: QnAHeaderModel, rhs: QnAHeaderModel): void {
    lhs.thisPK = rhs.thisPK;
    lhs.userPK = rhs.userPK;
    lhs.id = rhs.id;
    lhs.title = rhs.title;
    lhs.regDate = rhs.regDate;
    lhs.qnaState = rhs.qnaState;
  }
}
