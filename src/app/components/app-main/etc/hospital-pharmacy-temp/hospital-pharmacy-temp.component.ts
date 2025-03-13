import {ChangeDetectorRef, Component, Inject, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {HospitalTempService} from "../../../../services/rest/hospital-temp.service";
import * as FConstants from "../../../../guards/f-constants";
import {HospitalTempModel} from "../../../../models/rest/hospital/hospital-temp-model";
import {PharmacyTempModel} from "../../../../models/rest/hospital/pharmacy-temp-model";
import {DOCUMENT} from "@angular/common";
import {GoogleSetMarkerModel} from "../../../../models/common/google-set-marker-model";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FGoogleMapStyle from "../../../../guards/f-google-map-style";
import {GoogleMapComponent} from "../../../common/google-map/google-map.component";

@Component({
  selector: "app-hospital-pharmacy-temp",
  templateUrl: "./hospital-pharmacy-temp.component.html",
  styleUrl: "./hospital-pharmacy-temp.component.scss",
  standalone: false
})
export class HospitalPharmacyTempComponent extends FComponentBase {
  @ViewChild("googleMap") googleMap!: GoogleMapComponent;
  searchString: string = "";
  latitude: number = FConstants.DEF_LAT;
  longitude: number = FConstants.DEF_LNG;
  hospitalItems: HospitalTempModel[] = [];
  selectedHospital?: HospitalTempModel;
  pharmacyItems: PharmacyTempModel[] = [];
  selectedPharmacy?: PharmacyTempModel;
  pharmacyOn: boolean = true;
  themeNumber: number = 0;
  distance: number = 1000;
  constructor(@Inject(DOCUMENT) private document: Document, private cd: ChangeDetectorRef, private thisService: HospitalTempService) {
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
  async getNearbyPharmacyData(): Promise<void> {
    const hospitalItem = this.selectedHospital;
    if (hospitalItem == undefined) {
      return;
    }
    if (this.distance < 0) {
      this.distance = 0;
    }
    if (this.distance > 5000) {
      this.distance = 5000;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async () => await this.thisService.getPharmacyListNearBy(hospitalItem.latitude, hospitalItem.longitude, this.distance),
      e => this.fDialogService.error("getNearbyPharmacyData", e));
    this.setLoading(false);
    if (ret.result) {
      this.pharmacyItems = ret.data ?? [];
      await this.addPharmacyMarker();
      return;
    }
    this.fDialogService.warn("getNearbyPharmacyData", ret.msg);
  }
  async reGetNearbyPharmacyData(): Promise<void> {
    const hospitalItem = this.selectedHospital;
    if (hospitalItem == undefined) {
      return;
    }
    if (this.distance < 0) {
      this.distance = 0;
    }
    if (this.distance > 5000) {
      this.distance = 5000;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async () => await this.thisService.getPharmacyListNearBy(hospitalItem.latitude, hospitalItem.longitude, this.distance),
      e => this.fDialogService.error("getNearbyPharmacyData", e));
    this.setLoading(false);
    if (ret.result) {
      this.pharmacyItems = ret.data ?? [];
      await this.setHospitalMarker();
      await this.addPharmacyMarker();
      return;
    }
    this.fDialogService.warn("getNearbyPharmacyData", ret.msg);
  }

  async onSuccessGeolocation(data: any): Promise<void> {
    this.latitude = data.coords.latitude;
    this.longitude = data.coords.longitude;
    await this.googleMapPan(this.latitude, this.longitude);
  }
  onErrorGeolocation(): void {
  }

  async searchHospital(event: any): Promise<void> {
    if (this.searchString.length <= 2) {
      this.translateService.get("hospital-pharmacy-temp.warn.search-string").subscribe(x => {
        this.fDialogService.warn("search", x);
      });
      return;
    }

    await this.getSearchHospital();
  }
  async pharmacyToggle(): Promise<void> {
    this.pharmacyOn = !this.pharmacyOn;
    await this.setHospitalMarker();
    await this.addPharmacyMarker();
  }
  async selectHospitalChange(data?: HospitalTempModel): Promise<void> {
    if (data) {
      await this.openMap(data);
      await this.googleOpenInfoWindow(data);
      await this.getNearbyPharmacyData();
    }
  }
  async selectPharmacyChange(data?: PharmacyTempModel): Promise<void> {
    if (data) {
      await this.googleMapPan(data.latitude, data.longitude);
      await this.googleOpenInfoWindow(data);
    }
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
  async setHospitalMarker(): Promise<void> {
    const hospital = this.selectedHospital;
    if (hospital) {
      await this.googleMapMarkerClear();
      const markerModel: GoogleSetMarkerModel[] = [];
      markerModel.push(FExtensions.applyClass(GoogleSetMarkerModel, obj => {
        obj.title = hospital.orgName;
        obj.content = FGoogleMapStyle.hospitalContent(hospital.orgName, hospital.address, hospital.phoneNumber, hospital.websiteUrl);
        obj.position = {lat: hospital.latitude, lng: hospital.longitude};
        obj.icon.src = "/assets/icon/hospital_green.svg";
      }));
      await this.googleMapSetMarker(markerModel);
    }
  }
  async addPharmacyMarker(): Promise<void> {
    if (!this.pharmacyOn) {
      return;
    }
    const markerModel: GoogleSetMarkerModel[] = [];
    this.pharmacyItems.forEach(x => {
      markerModel.push(FExtensions.applyClass(GoogleSetMarkerModel, obj => {
        obj.title = x.orgName;
        obj.content = FGoogleMapStyle.pharmacyContent(x.orgName, x.address, x.phoneNumber);
        obj.position = {lat: x.latitude, lng: x.longitude};
        obj.icon.src = "/assets/icon/pharmacy_red.svg";
      }));
    });
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

  get filterFields(): string[] {
    return ["orgName", "address"];
  }
}
