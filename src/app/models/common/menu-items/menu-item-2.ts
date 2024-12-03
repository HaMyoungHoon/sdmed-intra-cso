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
        "path": "M420-260h120v-100h100v-120H540v-100H420v100H320v120h100v100ZM280-120q-33 0-56.5-23.5T200-200v-440q0-33 23.5-56.5T280-720h400q33 0 56.5 23.5T760-640v440q0 33-23.5 56.5T680-120H280Zm0-80h400v-440H280v440Zm-40-560v-80h480v80H240Zm40 120v440-440Z",
        "viewBox": "0 -900 900 900",
        "height": "18px",
        "width": "18px",
        routerLink: `/${FConstants.MEDICINE_LIST_URL}`
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
      }
    ]
  }
}
