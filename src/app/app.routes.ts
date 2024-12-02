import { Routes } from "@angular/router";
import * as FConstants from "./guards/f-constants"
import {AppMainComponent} from "./components/app-main/app-main.component";

export const routes: Routes = [
  { path: "", component: AppMainComponent,
    children: [
      { path: FConstants.DASH_BOARD_URL, loadChildren: () => import("./components/app-main/dash-board/dash-board.module").then(m => m.DashBoardModule) },

      { path: FConstants.MEDICINE_LIST_URL, loadChildren: () => import("./components/app-main/medicine/medicine-list/medicine-list.module").then(m => m.MedicineListModule) },
      { path: FConstants.HOSPITAL_LIST_URL, loadChildren: () => import("./components/app-main/hospital/hospital-list/hospital-list.module").then(m => m.HospitalListModule) },
      { path: FConstants.PHARMA_LIST_URL, loadChildren: () => import("./components/app-main/pharma/pharma-list/pharma-list.module").then(m => m.PharmaListModule) },

      { path: FConstants.MY_INFO_URL, loadChildren: () => import("./components/app-main/etc/user/my-info/my-info.module").then(m => m.MyInfoModule) },
      { path: FConstants.USER_INFO_URL, loadChildren: () => import("./components/app-main/etc/user/user-setting/user-setting.module").then(m => m.UserSettingModule) },
      { path: FConstants.USER_MAPPING_URL, loadChildren: () => import("./components/app-main/etc/user/user-mapping/user-mapping.module").then(m => m.UserMappingModule) },

      { path: FConstants.MAIN_INGREDIENT_METHOD_URL, loadChildren: () => import("./components/app-main/etc/manual/main-ingredient-method/main-ingredient-method.module").then(m => m.MainIngredientMethodModule) },
    ]
  },
  { path: FConstants.NOTFOUND_URL.slice(1), loadChildren: () => import("./components/notfound/notfound.module").then(m => m.NotfoundModule) },
  { path: FConstants.API_CSO.slice(1), loadChildren: () => import("./components/notfound/notfound.module").then(m => m.NotfoundModule) },
  { path: "**", redirectTo: FConstants.NOTFOUND_URL },
];
