import {MenuItem} from "primeng/api";
import {MenuItem1} from "./menu-items/menu-item-1";
import {MenuItem2} from "./menu-items/menu-item-2";
import {MenuItem3} from "./menu-items/menu-item-3";
import * as FConstants from "../../guards/f-constants";
import {MenuItem4} from "./menu-items/menu-item-4";

export function MainMenuItem(): MenuItem[] {
  const ret: MenuItem[] = [];
  ret.push(MenuItem1());
  ret.push(MenuItem4());
  ret.push(MenuItem2());
  ret.push(MenuItem3());
  return ret;
}
