import {MenuItem} from "primeng/api";
import * as FConstants from "../../../guards/f-constants";

export function MenuItem2(): MenuItem {
  return {
    label: "menu-2.title",
    visible: true,
    icon: "pi pi-fw pi-pencil",
    styleClass: "top-menu",
    items: [
      {
        label: "menu-2.sub-menu.sub-1",
        "path": "M260-361v-40H160v-80h200v-80H200q-17 0-28.5-11.5T160-601v-160q0-17 11.5-28.5T200-801h60v-40h80v40h100v80H240v80h160q17 0 28.5 11.5T440-601v160q0 17-11.5 28.5T400-401h-60v40h-80Zm298 240L388-291l56-56 114 114 226-226 56 56-282 282Z",
        "viewBox": "0 -900 900 900",
        "height": "18px",
        "width": "18px",
        routerLink: `/${FConstants.MEDICINE_PRICE_LIST_URL}`
      },
      {
        label: "menu-2.sub-menu.sub-2",
        "path": "M420-280h120v-100h100v-120H540v-100H420v100H320v120h100v100ZM160-120v-480l320-240 320 240v480H160Zm80-80h480v-360L480-740 240-560v360Zm240-270Z",
        "viewBox": "0 -900 900 900",
        "height": "18px",
        "width": "18px",
        routerLink: `/${FConstants.HOSPITAL_LIST_URL}`
      },
      {
        label: "menu-2.sub-menu.sub-3",
        "path": "M120-120v-80l80-240-80-240v-80h508l58-160 94 34-46 126h106v80l-80 240 80 240v80H120Zm320-160h80v-120h120v-80H520v-120h-80v120H320v80h120v120Zm-236 80h552l-80-240 80-240H204l80 240-80 240Zm276-240Z",
        "viewBox": "0 -900 900 900",
        "height": "18px",
        "width": "18px",
        routerLink: `/${FConstants.PHARMA_LIST_URL}`
      },
      {
        label: "menu-2.sub-menu.sub-4",
        "path": "m678-134 46-46-64-64-46 46q-14 14-14 32t14 32q14 14 32 14t32-14Zm102-102 46-46q14-14 14-32t-14-32q-14-14-32-14t-32 14l-46 46 64 64ZM735-77q-37 37-89 37t-89-37q-37-37-37-89t37-89l148-148q37-37 89-37t89 37q37 37 37 89t-37 89L735-77ZM200-200v-560 560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v245q-20-5-40-5t-40 3v-243H200v560h243q-3 20-3 40t5 40H200Zm280-670q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM280-600v-80h400v80H280Zm0 160v-80h400v34q-8 5-15.5 11.5T649-460l-20 20H280Zm0 160v-80h269l-49 49q-8 8-14.5 15.5T474-280H280Z",
        "viewBox": "0 -900 900 900",
        "height": "18px",
        "width": "18px",
        routerLink: `/${FConstants.MEDICINE_LIST_URL}`
      },
      {
        label: "menu-2.sub-menu.sub-5",
        "path": "M640-560v-126 126ZM174-132q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v337q-15-23-35.5-42T760-528v-204l-120 46v126q-21 0-41 3.5T560-546v-140l-160-56v523l-226 87Zm26-96 120-46v-468l-120 40v474Zm440-12q34 0 56.5-20t23.5-60q1-34-22.5-57T640-400q-34 0-57 23t-23 57q0 34 23 57t57 23Zm0 80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 43.5T778-238l102 102-56 56-102-102q-18 11-38.5 16.5T640-160ZM320-742v468-468Z",
        "viewBox": "0 -960 960 960",
        "height": "18px",
        "width": "18px",
        routerLink: `/${FConstants.HOSPITAL_TEMP_URL}`
      }
    ]
  };
}
