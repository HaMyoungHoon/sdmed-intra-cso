import {MenuItem} from "primeng/api";
import * as FConstants from "../../../guards/f-constants";

export function MenuItem4(): MenuItem {
  return {
    label: "menu-4.title",
    visible: true,
    styleClass: "top-menu",
    items: [
      {
        label: "menu-4.sub-menu.sub-1",
        visible: true,
        icon: "pi pi-fw pi-list",
        styleClass: "top-menu",
        routerLink: `/${FConstants.EDI_LIST_URL}`,
      },
      {
        label: "menu-4.sub-menu.sub-2",
        visible: true,
        icon: "pi pi-fw pi-history",
        styleClass: "top-menu",
        routerLink: `/${FConstants.EDI_DUE_DATE_URL}`,
      },
      {
        label: "menu-4.sub-menu.sub-3",
        visible: true,
        icon: "pi pi-fw pi-file-check",
        styleClass: "top-menu",
        routerLink: `/${FConstants.EDI_APPLY_DATE_URL}`,
      }
    ]
  };
}
