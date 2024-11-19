import {MenuItem} from "primeng/api";

export function MenuItem2(): MenuItem {
  return {
    label: "menu-2.title",
    visible: true,
    icon: "pi pi-fw pi-pencil",
    styleClass: "top-menu",
    routerLink: "/menu-2",
    items: [
      {
        label: "menu-2.sub-menu.sub-1",
        icon: "pi pi-fw pi-calendar",
        styleClass: "sub-menu",
        routerLink: "/menu-2/sub-1"
      },
      {
        label: "menu-2.sub-menu.sub-2",
        icon: "pi pi-fw pi-camera",
        styleClass: "sub-menu",
        routerLink: "/menu-2/sub-2"
      }
    ]
  }
}
