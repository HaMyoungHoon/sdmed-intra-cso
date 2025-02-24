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
      {
        label: "menu-3.sub-menu.sub-5",
        icon: "pi pi-fw pi-cog",
        styleClass: "sub-menu",
        routerLink: `/${FConstants.SETTING_URL}`
      },
      {
        label: "menu-3.sub-menu.sub-6",
        "path": "M240-360h96q19 0 32.5-13.5T382-406v-148q0-19-13.5-32.5T336-600h-96v240Zm46-46v-148h50v148h-50Zm149 46h98v-46h-82v-52h52v-46h-52v-50h82v-46h-98q-13 0-21.5 8.5T405-570v180q0 13 8.5 21.5T435-360Zm206-1q13 0 22.5-8.5T676-391l56-209h-48l-43 164-43-164h-48l56 209q3 13 12.5 21.5T641-361ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z",
        "viewBox": "0 -900 900 900",
        "height": "18px",
        "width": "18px",
        routerLink: `/${FConstants.LOG_LIST_URL}`
      },
      {
        label: "menu-3.sub-menu.sub-7",
        "path": "M240-360h96q19 0 32.5-13.5T382-406v-148q0-19-13.5-32.5T336-600h-96v240Zm46-46v-148h50v148h-50Zm149 46h98v-46h-82v-52h52v-46h-52v-50h82v-46h-98q-13 0-21.5 8.5T405-570v180q0 13 8.5 21.5T435-360Zm206-1q13 0 22.5-8.5T676-391l56-209h-48l-43 164-43-164h-48l56 209q3 13 12.5 21.5T641-361ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z",
        "viewBox": "0 -900 900 900",
        "height": "18px",
        "width": "18px",
        routerLink: `/${FConstants.IP_LOG_LIST_URL}`
      }
    ]
  };
}
