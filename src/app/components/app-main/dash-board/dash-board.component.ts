import {Component} from "@angular/core";
import {FComponentBase} from "../../../guards/f-component-base";
import {applyClass} from "../../../guards/f-extensions";
import {MqttContentModel} from "../../../models/rest/mqtt/mqtt-content-model";
import {MqttContentType} from "../../../models/rest/mqtt/mqtt-content-type";

@Component({
  selector: "app-dash-board",
  templateUrl: "./dash-board.component.html",
  styleUrl: "./dash-board.component.scss",
  standalone: false
})
export class DashBoardComponent extends FComponentBase {
  constructor() {
    super();
  }

  async test(): Promise<void> {
    const topic = "test/1234/test/1234";
    await this.mqttService.postPublish(topic, applyClass(MqttContentModel, obj => {
      obj.senderPK = "123123";
      obj.senderName = "test";
      obj.content = "콘텐츠";
      obj.contentType = MqttContentType.None;
      obj.targetItemPK = "43214321";
    }));
  }
}
