import {MenuItem} from "primeng/api";

export function MenuItem1(): MenuItem {
  return {
    label: "menu-1.title",
    visible: true,
    icon: "pi pi-fw pi-file",
    styleClass: "top-menu",
    routerLink: "/menu-1",
    items: [
      {
        label: "menu-1.sub-menu.sub-1",
        icon: "pi pi-fw pi-bars",
        styleClass: "sub-menu",
        routerLink: "/menu-1/sub-1"
      }
    ]
  }
}
