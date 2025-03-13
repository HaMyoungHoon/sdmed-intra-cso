import {ChangeDetectorRef, Component, Inject, ViewChild} from "@angular/core";
import {ProgressSpinner} from "primeng/progressspinner";
import {IftaLabel} from "primeng/iftalabel";
import {Button} from "primeng/button";
import {GoogleMapComponent} from "../../google-map/google-map.component";
import {Listbox} from "primeng/listbox";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {TranslatePipe} from "@ngx-translate/core";
import {PrimeTemplate} from "primeng/api";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import * as FGoogleMapStyle from "../../../../guards/f-google-map-style";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {HospitalTempModel} from "../../../../models/rest/hospital/hospital-temp-model";
import {DOCUMENT, NgIf} from "@angular/common";
import {HospitalTempService} from "../../../../services/rest/hospital-temp.service";
import {GoogleSetMarkerModel} from "../../../../models/common/google-set-marker-model";
import {AppConfigService} from "../../../../services/common/app-config.service";
import {PharmacyTempModel} from "../../../../models/rest/hospital/pharmacy-temp-model";

@Component({
  selector: "app-hospital-temp-find",
  imports: [ProgressSpinner, IftaLabel, Button, GoogleMapComponent, Listbox, FormsModule, InputText, TranslatePipe, PrimeTemplate, NgIf],
  templateUrl: "./hospital-temp-find.component.html",
  styleUrl: "./hospital-temp-find.component.scss",
  standalone: true
})
export class HospitalTempFindComponent extends FDialogComponentBase {
  @ViewChild("googleMap") googleMap!: GoogleMapComponent;
  searchString: string = "";
  latitude: number = FConstants.DEF_LAT;
  longitude: number = FConstants.DEF_LNG;
  hospitalItems: HospitalTempModel[] = [];
  selectedHospital?: HospitalTempModel;
  findNearbyAble: boolean = false;
  themeNumber: number = 0;
  constructor(@Inject(DOCUMENT) private document: Document, private cd: ChangeDetectorRef, private thisService: HospitalTempService, private appConfig: AppConfigService) {
    super();
    this.themeNumber = this.appConfig.getMapThemeNumber();
  }

  override async ngInit(): Promise<void> {
    this.getCurrentPosition();
  }

  getCurrentPosition(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.onSuccessGeolocation.bind(this), this.onErrorGeolocation.bind(this));
    }
  }
  async getSearchHospital(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getListSearch(this.searchString),
      e => this.onError("getSearchHospital", e));
    this.setLoading(false);
    if (ret.result) {
      this.hospitalItems = ret.data ?? [];
      return;
    }
    this.onWarn("getSearchHospital", ret.msg);
  }
  async getNearbyHospital(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getHospitalListNearBy(this.latitude, this.longitude),
      e => this.onError("getNearbyHospital", e));
    this.setLoading(false);
    if (ret.result) {
      this.hospitalItems = ret.data ?? [];
      return;
    }
    this.onWarn("getNearbyHospital", ret.msg);
  }
  hospitalSelect(): void {
    if (this.selectedHospital == null) {
      return;
    }
    this.ref.close(this.selectedHospital);
  }
  close(): void {
    this.ref.close();
  }

  onError(title: string, msg?: string): void {
    this.fDialogService.error(title, msg);
  }
  onWarn(title: string, msg?: string): void {
    this.fDialogService.error(title, msg);
  }
  tossError(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  tossWarn(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  async searchHospital(event: any): Promise<void> {
    if (this.searchString.length <= 2) {
      this.translateService.get("hospital-temp-find.warn.search-string").subscribe(x => {
        this.fDialogService.warn("search", x);
      });
      return;
    }

    await this.getSearchHospital();
  }
  async onSuccessGeolocation(data: any): Promise<void> {
    this.latitude = data.coords.latitude;
    this.longitude = data.coords.longitude;
    await this.googleMapPan(this.latitude, this.longitude);
    this.findNearbyAble = true;
  }
  onErrorGeolocation(): void {
    this.findNearbyAble = false;
  }
  async selectHospitalChange(data?: HospitalTempModel): Promise<void> {
    if (data) {
      await this.openMap(data);
      await this.googleOpenInfoWindow(data);
    }
  }
  get filterFields(): string[] {
    return ["orgName", "address"];
  }

  async openMap(data: HospitalTempModel): Promise<void> {
    await this.googleMapPan(data.latitude, data.longitude);
    await this.googleMapMarkerClear();
    const markerModel: GoogleSetMarkerModel[] = [];
    markerModel.push(FExtensions.applyClass(GoogleSetMarkerModel, obj => {
      obj.title = data.orgName;
      obj.content = FGoogleMapStyle.hospitalContent(data.orgName, data.address, data.phoneNumber, data.websiteUrl);
      obj.position = {lat: data.latitude, lng: data.longitude};
      obj.icon.src = "/assets/icon/hospital_green.svg";
    }));
    await this.googleMapSetMarker(markerModel);
  }

  async googleMapPan(latitude: number, longitude: number, zoom: number = 15): Promise<void> {
    this.cd.detectChanges();
    await FExtensions.awaitDelay(100);
    if (this.googleMap) {
      this.googleMap.panTo(latitude, longitude, zoom);
    }
  }
  async googleMapMarkerClear(): Promise<void> {
    if (this.googleMap) {
      this.googleMap.clearMarker();
    }
  }
  async googleMapSetMarker(markerModel: GoogleSetMarkerModel[]): Promise<void> {
    if (this.googleMap) {
      await this.googleMap.googleSetMarker(markerModel);
    }
  }
  async googleOpenInfoWindow(data: PharmacyTempModel): Promise<void> {
    if (this.googleMap) {
      await this.googleMap.googleOpenInfoWindow(FGoogleMapStyle.pharmacyContent(data.orgName, data.address, data.phoneNumber), {lat: data.latitude, lng: data.longitude});
    }
  }
}
