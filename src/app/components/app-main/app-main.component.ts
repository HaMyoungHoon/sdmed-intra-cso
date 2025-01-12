import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, ViewChild} from "@angular/core";
import {InputSwitchModule} from "primeng/inputswitch";
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MenuConfigComponent} from "../common/menu-config/menu-config.component";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FConstants from "../../guards/f-constants";
import {FDialogService} from "../../services/common/f-dialog.service";
import {NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {Subject, takeUntil} from "rxjs";
import * as FExtensions from "../../guards/f-extensions";
import {MqttService} from "../../services/rest/mqtt.service";
import {MqttConnectModel} from "../../models/rest/mqtt/mqtt-connect-model";
import {MqttContentModel} from "../../models/rest/mqtt/mqtt-content-model";
import {MqttContentType} from "../../models/rest/mqtt/mqtt-content-type";

@Component({
  selector: "app-app-main",
  imports: [InputSwitchModule, RouterOutlet, FormsModule, MenuConfigComponent, NgIf, ButtonModule],
  templateUrl: "./app-main.component.html",
  styleUrl: "./app-main.component.scss",
  standalone: true
})
export class AppMainComponent implements AfterViewInit, OnDestroy {
  @ViewChild("MenuConfigComponent") menuConfig!: MenuConfigComponent;
  viewPage: boolean = false;
  sub: Subject<any>[] = [];
  mqttConnectModel: MqttConnectModel = new MqttConnectModel();
  protected mqttService: MqttService;
  constructor(private cd: ChangeDetectorRef, private router: Router, private fDialogService: FDialogService) {
    this.mqttService = inject(MqttService);
  }

  async ngAfterViewInit(): Promise<void> {
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (FAmhohwa.isExpired(authToken)) {
      FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
      this.initChildComponents(false);
      this.openSignIn();
      return;
    }

    this.initChildComponents(true);
    await this.bindRouteEvents();
  }
  ngOnDestroy(): void {
    this.mqttService.mqttDisconnect();
    for (const buff of this.sub) {
      buff.complete();
    }
  }

  openSignIn(): void {
    this.unbindRouteEvents();
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openSignIn().pipe(takeUntil(sub)).subscribe(() => {
      this.closeSignIn();
    });
  }
  closeSignIn(): void {
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (FAmhohwa.isExpired(authToken)) {
      this.initChildComponents(false);
      return;
    }

    this.initChildComponents(true);
    this.cd.detectChanges();
    this.bindRouteEvents().then();
  }

  initChildComponents(data: boolean): void {
    this.viewPage = data;
    this.menuConfig.menuInit(data);
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (this.router.url == "/" && !FAmhohwa.isExpired(authToken)) {
      this.router.navigate([`/${FConstants.DASH_BOARD_URL}`]).then();
    }
    if (!data) {
      this.mqttService.mqttDisconnect();
    }
  }

  unbindRouteEvents(): void {
    for (const buff of this.sub) {
      buff.complete();
    }
    this.mqttService.mqttDisconnect();
  }
  async bindRouteEvents(): Promise<void> {
    const sub = new Subject();
    this.sub.push(sub);
    this.router.events.pipe(takeUntil(sub)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
        if (FAmhohwa.isExpired(authToken)) {
          FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
          this.initChildComponents(false);
          this.openSignIn();
        }
      }
      if (event instanceof NavigationEnd) {
        this.menuConfig.menuClose();
      }
    });
    await this.mqttInit();
  }

  async mqttInit(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.mqttService.getSubscribe(),
      e => this.fDialogService.error("mqttInit", e));
    if (!ret.result || ret.data == null) {
      this.fDialogService.warn("mqttInit", ret.msg);
      return;
    }
    this.mqttConnectModel = ret.data;
    this.mqttService.setMqttMessageObserver(x => {
      this.mqttMessageParse(x);
    });
    FExtensions.tryCatch(() => this.mqttService.mqttConnect(this.mqttConnectModel), e => this.fDialogService.error("mqttInit", e));
  }

  async mqttMessageParse(mqttContentModel: MqttContentModel): Promise<void> {
    if (mqttContentModel.senderPK == FAmhohwa.getThisPK()) {
      return;
    }
    let title: string = "";
    switch (mqttContentModel.contentType) {
      case MqttContentType.None: title = "mqtt-desc.title.none"; break;
      case MqttContentType.QNA_REQUEST: title = "mqtt-desc.title.qna-request"; break;
      case MqttContentType.QNA_REPLY: title = "mqtt-desc.title.qna-reply"; break;
      case MqttContentType.EDI_REQUEST: title = "mqtt-desc.title.edi-request"; break;
      case MqttContentType.EDI_REJECT: title = "mqtt-desc.title.edi-reject"; break;
      case MqttContentType.EDI_OK: title = "mqtt-desc.title.edi-ok"; break;
      case MqttContentType.EDI_RECEP: title = "mqtt-desc.title.edi-recep"; break;
    }
    this.fDialogService.mqttInfo(title, mqttContentModel.senderName,`${mqttContentModel.content}`, this.mqttConfirmFn, mqttContentModel);
  }
  async mqttConfirmFn(event: MouseEvent, message: any, router: Router): Promise<void> {
    const mqttContentModel = message.data["this-data"] as MqttContentModel;
    switch (mqttContentModel.contentType) {
      case MqttContentType.None: await router.navigate([`/${FConstants.DASH_BOARD_URL}`]); break;
      case MqttContentType.QNA_REQUEST:
      case MqttContentType.QNA_REPLY: await router.navigate([`/${FConstants.QNA_LIST_URL}/${mqttContentModel.targetItemPK}`]); break;
      case MqttContentType.EDI_REQUEST:
      case MqttContentType.EDI_REJECT:
      case MqttContentType.EDI_OK:
      case MqttContentType.EDI_RECEP: await router.navigate([`/${FConstants.EDI_LIST_URL}/${mqttContentModel.targetItemPK}`]); break;
    }
  }

  get testVisible(): boolean {
    return false;
  }
  async test(): Promise<void> {
//    this.fDialogService.mqttInfo("info", "detail", "text", this.testRouter, FExtensions.applyClass(MqttContentModel, obj => {
//      obj.senderName = "test sender";
//      obj.topic = "test topic";
//    }));
//    const mqtt = FExtensions.applyClass(MqttContentModel, (obj) => {
//      obj.senderPK = "senderPK test";
//      obj.senderName = "senderName test";
//      obj.content = "content test";
//      obj.contentType = MqttContentType.EDI_REJECT;
//      obj.targetItemPK = "targetItemPK test";
//    });
//    const ret = await FExtensions.restTry(async() => await this.mqttService.postPublish("notice", mqtt), e => this.fDialogService.error("test", e));
//    if (ret.result) {
//      return;
//    }
//    this.fDialogService.warn("test", ret.msg);
  }
}
