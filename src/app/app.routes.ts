import { Routes } from "@angular/router";
import * as FConstants from "./guards/f-constants"
import {AppMainComponent} from "./components/app-main/app-main.component";

export const routes: Routes = [
  { path: "", component: AppMainComponent,
    children: [
      { path: FConstants.DASH_BOARD_URL, loadChildren: () => import("./components/app-main/dash-board/dash-board.module").then(m => m.DashBoardModule) },

      { path: FConstants.EDI_LIST_URL, loadChildren: () => import("./components/app-main/edi/edi-list/edi-list.module").then(m => m.EdiListModule) },
      { path: FConstants.EDI_DUE_DATE_URL, loadChildren: () => import("./components/app-main/edi/edi-due-date/edi-due-date.module").then(m => m.EdiDueDateModule) },
      { path: FConstants.EDI_APPLY_DATE_URL, loadChildren: () => import("./components/app-main/edi/edi-apply-date/edi-apply-date.module").then(m => m.EdiApplyDateModule) },
      { path: FConstants.EDI_VIEW_URL, loadChildren: () => import("./components/app-main/edi/edi-view/edi-view.module").then(m => m.EdiViewModule) },
      { path: FConstants.EDI_CHECK_LIST_URL, loadChildren: () => import("./components/app-main/edi/edi-check-list/edi-check-list.module").then(m => m.EdiCheckListModule) },

      { path: FConstants.QNA_LIST_URL, loadChildren: () => import("./components/app-main/qna/qna-list/qna-list.module").then(m => m.QnaListModule) },
      { path: FConstants.QNA_VIEW_URL, loadChildren: () => import("./components/app-main/qna/qna-view/qna-view.module").then(m => m.QnaViewModule) },

      { path: FConstants.MEDICINE_PRICE_LIST_URL, loadChildren: () => import("./components/app-main/medicine/medicine-price-list/medicine-price-list.module").then(m => m.MedicinePriceListModule) },

      { path: FConstants.HOSPITAL_LIST_URL, loadChildren: () => import("./components/app-main/hospital/hospital-list/hospital-list.module").then(m => m.HospitalListModule) },
      { path: FConstants.HOSPITAL_NEW_URL, loadChildren: () => import("./components/app-main/hospital/hospital-add/hospital-add.module").then(m => m.HospitalAddModule) },
      { path: FConstants.HOSPITAL_EDIT_URL, loadChildren: () => import("./components/app-main/hospital/hospital-edit/hospital-edit.module").then(m => m.HospitalEditModule) },

      { path: FConstants.PHARMA_LIST_URL, loadChildren: () => import("./components/app-main/pharma/pharma-list/pharma-list.module").then(m => m.PharmaListModule) },
      { path: FConstants.PHARMA_NEW_URL, loadChildren: () => import("./components/app-main/pharma/pharma-add/pharma-add.module").then(m => m.PharmaAddModule) },
      { path: FConstants.PHARMA_EDIT_URL, loadChildren: () => import("./components/app-main/pharma/pharma-edit/pharma-edit.module").then(m => m.PharmaEditModule) },

      { path: FConstants.MEDICINE_LIST_URL, loadChildren: () => import("./components/app-main/medicine/medicine-list/medicine-list.module").then(m => m.MedicineListModule) },
      { path: FConstants.MEDICINE_NEW_URL, loadChildren: () => import("./components/app-main/medicine/medicine-add/medicine-add.module").then(m => m.MedicineAddModule) },
      { path: FConstants.MEDICINE_EDIT_URL, loadChildren: () => import("./components/app-main/medicine/medicine-edit/medicine-edit.module").then(m => m.MedicineEditModule) },

      { path: FConstants.MY_INFO_URL, loadChildren: () => import("./components/app-main/etc/user/my-info/my-info.module").then(m => m.MyInfoModule) },
      { path: FConstants.USER_INFO_URL, loadChildren: () => import("./components/app-main/etc/user/user-setting/user-setting.module").then(m => m.UserSettingModule) },
      { path: FConstants.USER_NEW_URL, loadChildren: () => import("./components/app-main/etc/user/user-add/user-add.module").then(m => m.UserAddModule) },
      { path: FConstants.USER_EDIT_URL, loadChildren: () => import("./components/app-main/etc/user/user-edit/user-edit.module").then(m => m.UserEditModule) },

      { path: FConstants.USER_MAPPING_URL, loadChildren: () => import("./components/app-main/etc/user/user-mapping/user-mapping.module").then(m => m.UserMappingModule) },

      { path: FConstants.MAIN_INGREDIENT_METHOD_URL, loadChildren: () => import("./components/app-main/etc/manual/main-ingredient-method/main-ingredient-method.module").then(m => m.MainIngredientMethodModule) },

      { path: FConstants.SETTING_URL, loadChildren: () => import("./components/app-main/etc/setting/setting.module").then(m => m.SettingModule) }
    ]
  },
  { path: FConstants.NOTFOUND_URL.slice(1), loadChildren: () => import("./components/notfound/notfound.module").then(m => m.NotfoundModule) },
  { path: FConstants.API_CSO.slice(1), loadChildren: () => import("./components/notfound/notfound.module").then(m => m.NotfoundModule) },
  { path: "**", redirectTo: FConstants.NOTFOUND_URL },
];
