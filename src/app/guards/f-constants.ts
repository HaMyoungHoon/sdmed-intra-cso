export const AUTH_TOKEN: string = "token";

export const STORAGE_KEY_LANG: string = "lang";
export const STORAGE_DASHBOARD_VIEW_TYPE: string = "dashboardViewType";
export const STORAGE_QNA_VIEW_TYPE: string = "qnaViewType";
export const STORAGE_IMAGE_CACHE_CLEAR_TIME: string = "imageCacheClearTime";
export const STORAGE_INFO_STICKY: string = "infoSticky";
export const STORAGE_TOAST_LIFE: string = "toastLife";

export const HEADERS_CACHE_TIMESTAMP: string = "X-Cache-Timestamp";
export const CACHES_IMAGE_CACHE: string = "image-cache";

export const THEME_LINK: string = "app-theme";
export const MQTT_CONNECT_DATA: string = "mqtt-connect";
export const LOADING_IMAGE_ARRAY: string = "loading-image-array";
export const MEDICINE_PRICE_HEADER_LIST: string = "medicinePriceHeaderList";

export const NOTFOUND_URL: string = "/notfound";
export const API_CSO: string = "/apiCSO";

export const DASH_BOARD_URL: string = "dashBoard";

export const EDI_LIST_URL: string = "ediList";
export const EDI_DUE_DATE_URL: string = "ediDueDate";
export const EDI_APPLY_DATE_URL: string = "ediApplyDate";
export const EDI_VIEW_URL: string = "ediList/:thisPK";
export const EDI_CHECK_LIST_URL: string = "ediCheckList";

export const QNA_LIST_URL: string = "qnaList";
export const QNA_VIEW_URL: string = "qnaList/:thisPK";

export const HOSPITAL_LIST_URL: string = "hospital-list";
export const HOSPITAL_NEW_URL: string = "hospital-list/new";
export const HOSPITAL_EDIT_URL: string = "hospital-list/:thisPK";

export const PHARMA_LIST_URL: string = "pharma-list";
export const PHARMA_NEW_URL: string= "pharma-list/new";
export const PHARMA_EDIT_URL: string = "pharma-list/:thisPK";

export const MEDICINE_PRICE_LIST_URL: string = "medicine-price-list"
export const MEDICINE_LIST_URL: string = "medicine-list";
export const MEDICINE_NEW_URL: string = "medicine-list/new";
export const MEDICINE_EDIT_URL: string = "medicine-list/:thisPK";

export const MY_INFO_URL: string = "etc/myInfo";
export const USER_INFO_URL: string = "etc/userInfo";
export const USER_NEW_URL: string = "etc/userInfo/new";
export const USER_EDIT_URL: string = "etc/userInfo/:thisPK";

export const USER_MAPPING_URL: string = "etc/userMapping";
export const MAIN_INGREDIENT_METHOD_URL: string = "etc/manual/main_ingredient_method";
export const SETTING_URL: string = "etc/setting";
export const LOG_LIST_URL: string = "etc/logList";

export const ASSETS_NO_IMAGE: string = "assets/image/no-image-1920.png";
export const ASSETS_ZIP_IMAGE: string = "assets/image/zip-image.png";
export const ASSETS_PDF_IMAGE: string = "assets/image/pdf-image.png";
export const ASSETS_XLSX_IMAGE: string = "assets/image/excel-image.png";
export const ASSETS_DOCX_IMAGE: string = "assets/image/word-image.png";

export const ASSETS_LOADING_IMAGE: string[] = [
  "assets/image/loading_0.webp",
  "assets/image/loading_1.webp",
  "assets/image/loading_2.webp",
  "assets/image/loading_3.webp",
  "assets/image/loading_4.webp",
  "assets/image/loading_5.webp",
  "assets/image/loading_6.webp",
  "assets/image/loading_7.webp",
  "assets/image/loading_8.webp",
];
export const DEF_LOADING_IMAGE_ARRAY: number[] = [0,1,2,3,4,5,6,7,8];

export const tableStyle: {"min-width": string} = {"min-width": "25rem"};
export const filterTableOption: string = "contains";
export const galleriaContainerStyle: {"width": string, "height": string} = {"width": "560px", "height": "660px"};

export const FILL_CROP_ORIGIN_COLOR = "#0000005F";
export const FILL_CROP_BORDER_COLOR = "#18C818FF"
export const FILL_CROP_BORDER_WIDTH = 4;
export const FILL_BACKGROUND_COLOR = "#FFFFFF";

export const REGEX_CHECK_ID: RegExp = /^[A-Za-z0-9가-힣]{3,20}$/;
export const REGEX_CHECK_PASSWORD_0: RegExp = /^(?=.*[A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ])(?=.*[0-9]).{8,20}$/;
export const REGEX_CHECK_PASSWORD_1: RegExp = /^(?=.*[A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ])(?=.*[()!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
export const REGEX_CHECK_PASSWORD_2: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
export const REGEX_HEX_COLOR_RGB: RegExp = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i;
export const REGEX_HEX_COLOR_RGBA: RegExp = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i;
