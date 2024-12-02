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
        icon: "pi pi-fw pi-calendar",
        styleClass: "sub-menu",
        routerLink: `/${FConstants.MEDICINE_LIST_URL}`
      },
      {
        label: "menu-2.sub-menu.sub-2",
        icon: "pi pi-fw pi-shop",
        styleClass: "sub-menu",
        routerLink: `/${FConstants.HOSPITAL_LIST_URL}`
      },
      {
        label: "menu-2.sub-menu.sub-3",
        icon: "pi pi-fw pi-camera",
        styleClass: "sub-menu",
        routerLink: `/${FConstants.PHARMA_LIST_URL}`
      }
    ]
  }
}
