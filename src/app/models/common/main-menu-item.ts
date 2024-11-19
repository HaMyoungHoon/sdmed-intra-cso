import {MenuItem} from "primeng/api";
import {MenuItem1} from "./menu-items/menu-item-1";
import {MenuItem2} from "./menu-items/menu-item-2";
import {MenuItem3} from "./menu-items/menu-item-3";
import * as FConstants from "../../guards/f-constants";

export function MainMenuItem(): MenuItem[] {
  const ret: MenuItem[] = [];
  ret.push(dashBoard);
  ret.push(MenuItem1());
  ret.push(MenuItem2());
  ret.push(MenuItem3());
  return ret;
}

export let dashBoard : MenuItem = {
  label: "dash-board.title",
  visible: true,
  icon: "pi pi-fw pi-home",
  styleClass: "top-menu",
  routerLink: `/${FConstants.DASH_BOARD}`,
}
