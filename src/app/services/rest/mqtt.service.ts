import {Injectable} from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {MqttConnectModel} from "../../models/rest/mqtt/mqtt-connect-model";
import {MqttContentModel} from "../../models/rest/mqtt/mqtt-content-model";
import mqtt, {IDisconnectPacket} from "mqtt";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FExtensions from "../../guards/f-extensions";
import * as FConstants from "../../guards/f-constants";
import {Subject} from "rxjs";
import {MqttContentType} from "../../models/rest/mqtt/mqtt-content-type";
import {EDIState} from "../../models/rest/edi/edi-state";
import {ediStateToMqttContentType} from "../../guards/f-extensions";

@Injectable({
  providedIn: "root"
})
export class MqttService {
  private baseUrl = "/apiCSO/mqtt";
  mqttClient?: mqtt.MqttClient
  mqttMessageSubject: Subject<MqttContentModel> = new Subject();
  mqttDisconnectSubject: Subject<IDisconnectPacket> = new Subject<IDisconnectPacket>();

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getSubscribe(): Promise<RestResult<MqttConnectModel>> {
    const mqttConnectData = FAmhohwa.getLocalStorage(FConstants.MQTT_CONNECT_DATA);
    if (mqttConnectData.length > 0) {
      return new Promise((resolve) => {
        resolve(new RestResult<MqttConnectModel>().getResult(JSON.parse(mqttConnectData)));
      });
    }
    return this.httpResponse.get(`${this.baseUrl}/subscribe`);
  }
  postPublish(topic: string, mqttContentModel: MqttContentModel): Promise<RestResult<any>> {
    if (this.mqttClient?.connected != true) {
      return new Promise((resolve): void => {
        resolve(new RestResult<any>().setFail("통신에러"));
      });
    }
    this.httpResponse.addParam("topic", topic);
    return this.httpResponse.post(`${this.baseUrl}/publish`, mqttContentModel);
  }
  async postQnA(userPK: string, thisPK: string, content: string): Promise<RestResult<any>> {
    const topic = `private/${userPK}`;
    await this.postPublish(topic, FExtensions.applyClass(MqttContentModel, (obj) => {
      obj.contentType = MqttContentType.QNA_REPLY;
      obj.content = content;
      obj.targetItemPK = thisPK;
    }));
    return new Promise((resolve): void => {
      resolve(new RestResult<any>().setFail("통신에러"));
    });
  }
  async postEDIResponse(userPK: string, thisPK: string, content: string, ediState: EDIState): Promise<RestResult<any>> {
    const topic = `private/${userPK}`;
    const mqttContentType = FExtensions.ediStateToMqttContentType(ediState);
    await this.postPublish(topic, FExtensions.applyClass(MqttContentModel, (obj) => {
      obj.contentType = mqttContentType;
      obj.content = content;
      obj.targetItemPK = thisPK;
    }));
    return new Promise((resolve): void => {
      resolve(new RestResult<any>().setFail("통신에러"));
    });
  }
  mqttConnect(mqttConnectModel: MqttConnectModel): void {
    if (this.mqttClient?.connected) {
      return;
    }
    const clientId: string = mqttConnectModel.topic.length > 1 ? mqttConnectModel.topic[1] : FAmhohwa.getRandomUUID();
    const options: mqtt.IClientOptions = {
      defaultProtocol: "wss",
      protocol: "wss",
      clientId: `intra-cso-${clientId}`,
      username: mqttConnectModel.userName,
      password: mqttConnectModel.password
    }
    const search: string[] = mqttConnectModel.brokerUrl.filter(x => x.includes("ws://") || x.includes("wss://"));
    if (search.length <= 0) {
      throw new Error("something wrong");
    }

    this.mqttClient = mqtt.connect(search[0], options);
    this.mqttClient.on("connect", (): void => {
      mqttConnectModel.topic.forEach((x: string): void => {
        this.mqttClient?.subscribe(x, (err: Error | null): void => {
          if (err) {
            throw new Error(err.message);
          }
        });
      });
    });
    this.mqttClient.on("error", (error: Error | mqtt.ErrorWithReasonCode): void => {
      const reasonCode = (error as mqtt.ErrorWithReasonCode);
      if (reasonCode.code == 3) {
        FAmhohwa.removeLocalStorage(FConstants.MQTT_CONNECT_DATA);
      }
    });
    this.mqttClient.on("message", (topic: string, message: Buffer): void => {
      this.mqttMessageSubject.next(new MqttContentModel().parseThis(topic, message));
    });
    this.mqttClient.on("disconnect", (packet: IDisconnectPacket): void => {
      this.mqttDisconnectSubject.next(packet);
    });
  }
  mqttDisconnect(): void {
    if (this.mqttClient?.connected) {
      this.mqttClient.end();
    }
    FAmhohwa.removeLocalStorage(FConstants.MQTT_CONNECT_DATA);
  }
  setMqttMessageObserver(func: FExtensions.anyFunc | undefined): void {
    this.mqttMessageSubject.pipe().subscribe((x: MqttContentModel): void => {
      if (func) {
        func(x);
      }
    });
  }
  setMqttDisconnectObserver(func: FExtensions.anyFunc | undefined): void {
    this.mqttDisconnectSubject.pipe().subscribe((x: IDisconnectPacket): void => {
      if (func) {
        func(x);
      }
    });
  }
}
