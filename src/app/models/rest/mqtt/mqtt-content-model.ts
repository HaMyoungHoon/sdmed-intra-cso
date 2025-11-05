import {MqttContentType} from "./mqtt-content-type";

export class MqttContentModel {
  senderPK: string = "";
  senderID: string = "";
  senderName: string = "";
  content: string = "";
  contentType: MqttContentType = MqttContentType.None;
  targetItemPK: string = "";

  parseThis(payload: Buffer): MqttContentModel {
    try {
      const buff = JSON.parse(payload.toString()) as MqttContentModel;
      this.senderPK = buff.senderPK;
      this.senderID = buff.senderID;
      this.senderName = buff.senderName;
      this.content = buff.content;
      this.contentType = buff.contentType;
      this.targetItemPK = buff.targetItemPK;
    } catch (e) {
    }
    return this;
  }
}
