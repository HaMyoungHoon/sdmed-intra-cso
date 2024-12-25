import {MenuItem} from "primeng/api";
import * as FConstants from "../../../guards/f-constants";

export function MenuItem3(): MenuItem {
  return {
    label: "menu-3.title",
    visible: true,
    icon: "pi pi-fw pi-user",
    styleClass: "top-menu",
    items: [
      {
        label: "menu-3.sub-menu.sub-1",
        icon: "pi pi-fw pi-book",
        styleClass: "sub-menu",
        routerLink: `/${FConstants.MY_INFO_URL}`
      },
      {
        label: "menu-3.sub-menu.sub-2",
        icon: "pi pi-fw pi-users",
        styleClass: "sub-menu",
        routerLink: `/${FConstants.USER_INFO_URL}`
      },
      {
        label: "menu-3.sub-menu.sub-3",
        icon: "pi pi-fw pi-sitemap",
        styleClass: "sub-menu",
        routerLink: `/${FConstants.USER_MAPPING_URL}`
      },
      {
        label: "menu-3.sub-menu.sub-4",
        icon: "pi pi-fw pi-chart-bar",
        styleClass: "sub-menu",
        routerLink: `/${FConstants.MAIN_INGREDIENT_METHOD_URL}`
      },
    ]
  };
}
