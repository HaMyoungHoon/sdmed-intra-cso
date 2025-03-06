import {MqttContentType} from "./mqtt-content-type";

export class MqttContentModel {
  topic: string = "";
  senderPK: string = "";
  senderID: string = "";
  senderName: string = "";
  content: string = "";
  contentType: MqttContentType = MqttContentType.None;
  targetItemPK: string = "";

  parseThis(topic: string, payload: Buffer): MqttContentModel {
    this.topic = topic;
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
