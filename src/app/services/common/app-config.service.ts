import {computed, effect, inject, Injectable, PLATFORM_ID, signal} from "@angular/core";
import * as FConstants from "../../guards/f-constants";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FExtensions from "../../guards/f-extensions";
import {AppState} from "../../models/common/app-state";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {TableHeaderModel} from "../../models/common/table-header-model";
import {PaintConfigModel} from "../../models/common/paint-config-model";

@Injectable({
  providedIn: "root"
})
export class AppConfigService {
  appState = signal<AppState>(new AppState());
  paintConfig = signal<PaintConfigModel>(new PaintConfigModel());
  document = inject(DOCUMENT);
  platformId = inject(PLATFORM_ID);
  transitionComplete = signal<boolean>(false);
  constructor() {
    this.appState.set({ ...this.loadAppState() });
    this.paintConfig.set({...this.loadPaintConfig()});
    effect(
      () => {
        const state = this.appState();
        this.saveAppState(state);
        console.log(state);
        this.handleDarkModeTransition(state);
      },
      { }
    );
  }


  hideMenu(): void {
    this.appState.update((state) => ({
      ...state,
      menuActive: false
    }));
  }
  showMenu(): void {
    this.appState.update((state) => ({
      ...state,
      menuActive: true
    }));
  }
  toggleDarkMode(toDark: boolean): void {
    this.appState.update((state) => ({
      ...state,
      darkTheme: toDark
    }));
  }
  changeScale(scale: number): void {
    this.appState.update((state) => ({
      ...state,
      scale: scale
    }));
  }
  changeNewTab(isNewTab: boolean): void {
    this.appState.update((state) => ({
      ...state,
      isNewTab: isNewTab
    }));
  }
  toggleInfoSticky(sticky: boolean): void {
    this.appState.update((state) => ({
      ...state,
      sticky: sticky
    }));
  }
  setToastLife(life: number): void {
    if (life < 3000) {
      life = 3000;
    } else if (life > 10000) {
      life = 10000;
    }
    this.appState.update((state) => ({
      ...state,
      toastLife: life
    }));
  }
  setTextSize(data: number): void {
    if (data < 0) {
      return;
    }
    this.paintConfig.update((config) => ({
      ...config,
      textSize: data
    }));
    this.savePaintConfig(this.paintConfig());
  }
  setTextColor(data: string): void {
    if (FExtensions.isValidHexColor(data)) {
      this.paintConfig.update((config) => ({
        ...config,
        textColor: data
      }));
      this.savePaintConfig(this.paintConfig());
    }
  }
  setTextBackColor(data: string): void {
    if (FExtensions.isValidHexColor(data)) {
      this.paintConfig.update((config) => ({
        ...config,
        textBackColor: data
      }));
      this.savePaintConfig(this.paintConfig());
    }
  }
  setBrushSize(data: number): void {
    if (data < 0) {
      return;
    }
    this.paintConfig.update((config) => ({
      ...config,
      brushSize: data
    }));
    this.savePaintConfig(this.paintConfig());
  }
  setBrushAlpha(data: number): void {
    if (data < 0 || data > 255) {
      return;
    }
    this.paintConfig.update((config) => ({
      ...config,
      brushAlpha: data
    }));
    this.savePaintConfig(this.paintConfig());
  }
  setBrushColor(data: string): void {
    if (FExtensions.isValidHexColor(data)) {
      this.paintConfig.update((config) => ({
        ...config,
        brushColor: data
      }));
      this.savePaintConfig(this.paintConfig());
    }
  }
  setSquareSize(data: number): void {
    if (data < 0) {
      return;
    }
    this.paintConfig.update((config) => ({
      ...config,
      squareSize: data
    }));
    this.savePaintConfig(this.paintConfig());
  }
  setSquareAlpha(data: number): void {
    if (data < 0 || data > 255) {
      return;
    }
    this.paintConfig.update((config) => ({
      ...config,
      squareAlpha: data
    }));
    this.savePaintConfig(this.paintConfig());
  }
  setSquareColor(data: string): void {
    if (FExtensions.isValidHexColor(data)) {
      this.paintConfig.update((config) => ({
        ...config,
        squareColor: data
      }));
      this.savePaintConfig(this.paintConfig());
    }
  }

  isDarkMode = computed(() => this.appState().darkTheme ?? false);
  isMenuActive = computed(() => this.appState().menuActive ?? false);
  isNewTab = computed(() => this.appState().isNewTab ?? false);
  getScale = computed(() => this.appState().scale ?? 14);
  isInfoSticky = computed(() => this.appState().sticky ?? true);
  getToastLife = computed(() => this.appState().toastLife ?? 3000);
  getTextSize = computed(() => this.paintConfig().textSize ?? 0);
  getTextColor = computed(() => this.paintConfig().textColor ?? "#000000");
  getTextBackColor = computed(() => this.paintConfig().textBackColor ?? "#FFFFFF");
  getBrushSize = computed(() => this.paintConfig().brushSize ?? 1);
  getBrushAlpha = computed(() => this.paintConfig().brushAlpha ?? 255);
  getBrushColor = computed(() => this.paintConfig().brushColor ?? "#FFFFAF");
  getSquareSize = computed(() => this.paintConfig().squareSize ?? 1);
  getSquareAlpha = computed(() => this.paintConfig().squareAlpha ?? 255);
  getSquareColor = computed(() => this.paintConfig().squareColor ?? "#FF5F5F");

  private onTransitionEnd(): void {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }
  private handleDarkModeTransition(state: AppState): void {
    if (isPlatformBrowser(this.platformId)) {
      if ((document as any).startViewTransition) {
        this.scaled(state);
        this.startViewTransition(state);
      } else {
        this.toggledDarkMode(state);
        this.onTransitionEnd();
      }
    }
  }
  private startViewTransition(state: AppState): void {
    const transition = (document as any).startViewTransition(() => {
      this.toggledDarkMode(state);
    });
    console.log(transition);
    transition.ready.then(() => this.onTransitionEnd());
  }
  private toggledDarkMode(state: AppState): void {
    if (state.darkTheme) {
      this.document.documentElement.classList.add("p-dark");
    } else {
      this.document.documentElement.classList.remove("p-dark");
    }
  }
  private scaled(state: AppState): void {
    this.document.documentElement.style.fontSize = `${state.scale}px`;
  }
  private loadAppState(): AppState {
    if (isPlatformBrowser(this.platformId)) {
      const storedState = FAmhohwa.getLocalStorage(FConstants.THEME_LINK);
      if (storedState.length > 0) {
        return JSON.parse(storedState);
      }
    }
    return new AppState();
  }
  private loadPaintConfig(): PaintConfigModel {
    if (isPlatformBrowser(this.platformId)) {
      const storedConfig = FAmhohwa.getLocalStorage(FConstants.PAINT_CONFIG);
      if (storedConfig.length > 0) {
        return JSON.parse(storedConfig);
      }
    }
    return new PaintConfigModel();
  }

  private saveAppState(state: any): void {
    if (isPlatformBrowser(this.platformId)) {
      FAmhohwa.setLocalStorage(FConstants.THEME_LINK, JSON.stringify(state));
    }
  }
  private savePaintConfig(config: any): void {
    if (isPlatformBrowser(this.platformId)) {
      FAmhohwa.setLocalStorage(FConstants.PAINT_CONFIG, JSON.stringify(config));
    }
  }

  getMapThemeNumber(): number {
    const buff = FAmhohwa.getLocalStorage(FConstants.MAP_THEME_NUMBER);
    if (buff.length <= 0) {
      return 0;
    }
    return Number(buff) ?? 0;
  }
  setMapThemeNumber(data: number): void {
    if (data < 0) {
      return;
    }
    FAmhohwa.setLocalStorage(FConstants.MAP_THEME_NUMBER, data.toString());
  }

  getEDIListTableHeaderList(): TableHeaderModel[] {
    const buff = FAmhohwa.getLocalStorage(FConstants.EDI_LIST_HEADER_LIST)
    if (buff.length <= 0) {
      return [];
    }
    return JSON.parse(buff) as TableHeaderModel[]
  }
  setEDIListTableHeaderList(data: TableHeaderModel[]): void {
    const buff = JSON.stringify(data);
    FAmhohwa.setLocalStorage(FConstants.EDI_LIST_HEADER_LIST, buff);
  }
  getHospitalListTableHeaderList(): TableHeaderModel[] {
    const buff = FAmhohwa.getLocalStorage(FConstants.HOSPITAL_LIST_HEADER_LIST)
    if (buff.length <= 0) {
      return [];
    }
    return JSON.parse(buff) as TableHeaderModel[]
  }
  setHospitalListTableHeaderList(data: TableHeaderModel[]): void {
    const buff = JSON.stringify(data);
    FAmhohwa.setLocalStorage(FConstants.HOSPITAL_LIST_HEADER_LIST, buff);
  }
  getPharmaListTableHeaderList(): TableHeaderModel[] {
    const buff = FAmhohwa.getLocalStorage(FConstants.PHARMA_LIST_HEADER_LIST)
    if (buff.length <= 0) {
      return [];
    }
    return JSON.parse(buff) as TableHeaderModel[]
  }
  setPharmaListTableHeaderList(data: TableHeaderModel[]): void {
    const buff = JSON.stringify(data);
    FAmhohwa.setLocalStorage(FConstants.PHARMA_LIST_HEADER_LIST, buff);
  }
  getMedicineListTableHeaderList(): TableHeaderModel[] {
    const buff = FAmhohwa.getLocalStorage(FConstants.MEDICINE_LIST_HEADER_LIST)
    if (buff.length <= 0) {
      return [];
    }
    return JSON.parse(buff) as TableHeaderModel[]
  }
  setMedicineListTableHeaderList(data: TableHeaderModel[]): void {
    const buff = JSON.stringify(data);
    FAmhohwa.setLocalStorage(FConstants.MEDICINE_LIST_HEADER_LIST, buff);
  }
  getMedicinePriceListTableHeaderList(): TableHeaderModel[] {
    const buff = FAmhohwa.getLocalStorage(FConstants.MEDICINE_LIST_PRICE_HEADER_LIST);
    if (buff.length <= 0) {
      return [];
    }
    return JSON.parse(buff) as TableHeaderModel[]
  }
  setMedicinePriceListTableHeaderList(data: TableHeaderModel[]): void {
    const buff = JSON.stringify(data);
    FAmhohwa.setLocalStorage(FConstants.MEDICINE_LIST_PRICE_HEADER_LIST, buff);
  }
  getIPLogListTableHeaderList(): TableHeaderModel[] {
    const buff = FAmhohwa.getLocalStorage(FConstants.IP_LOG_LIST_HEADER_LIST);
    if (buff.length <= 0) {
      return [];
    }
    return JSON.parse(buff) as TableHeaderModel[]
  }
  setIPLogTableHeaderList(data: TableHeaderModel[]): void {
    const buff = JSON.stringify(data);
    FAmhohwa.setLocalStorage(FConstants.IP_LOG_LIST_HEADER_LIST, buff);
  }
  getCalendarViewType(): string {
    const buff = FAmhohwa.getLocalStorage(FConstants.CALENDAR_VIEW_TYPE);
    if (buff.length <= 0) {
      return "dayGridMonth"
    }
    return buff;
  }
  setCalendarViewType(typeString: string): void {
    FAmhohwa.setLocalStorage(FConstants.CALENDAR_VIEW_TYPE, typeString);
  }

  allStorageClear(): void {
    const storage: string[] = [
      FConstants.STORAGE_KEY_LANG,
      FConstants.STORAGE_DASHBOARD_VIEW_TYPE,
      FConstants.STORAGE_QNA_VIEW_TYPE,
      FConstants.STORAGE_IMAGE_CACHE_CLEAR_TIME,
      FConstants.CACHES_IMAGE_CACHE,
      FConstants.THEME_LINK,
      FConstants.MQTT_CONNECT_DATA,
      FConstants.LOADING_IMAGE_ARRAY,
      FConstants.EDI_LIST_HEADER_LIST,
      FConstants.HOSPITAL_LIST_HEADER_LIST,
      FConstants.PHARMA_LIST_HEADER_LIST,
      FConstants.MEDICINE_LIST_HEADER_LIST,
      FConstants.MEDICINE_LIST_PRICE_HEADER_LIST,
      FConstants.MEDICINE_LIST_PRICE_HEADER_LIST,
      FConstants.IP_LOG_LIST_HEADER_LIST,
      FConstants.CALENDAR_VIEW_TYPE
    ];
    storage.forEach(x => FAmhohwa.removeLocalStorage(x));
  }
}
