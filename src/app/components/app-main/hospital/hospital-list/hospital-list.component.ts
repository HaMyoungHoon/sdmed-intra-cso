import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {HospitalService} from "../../../../services/rest/hospital.service";
import {tryCatchAsync} from "../../../../guards/f-extensions";
import {FDialogService} from "../../../../services/common/f-dialog.service";
import {HospitalModel} from "../../../../models/rest/hospital-model";

@Component({
  selector: "app-hospital-list",
  templateUrl: "./hospital-list.component.html",
  styleUrl: "./hospital-list.component.scss",
  standalone: false,
})
export class HospitalListComponent extends FComponentBase {
  hospitalList: HospitalModel[] = [];
  constructor(private hospitalService: HospitalService, private fDialogService: FDialogService) {
    super();
  }

  override async ngInit(): Promise<void> {
    await this.getHospitalAll();
  }
  async getHospitalAll(): Promise<void> {
    const ret = await tryCatchAsync(async() => await this.hospitalService.getHospitalAll(),
      e => this.fDialogService.error("getHospitalAll", e.message));
    if (ret) {
      if (ret.result) {
        this.hospitalList = ret.data ?? [];
        return;
      }
      this.fDialogService.warn("getHospitalAll", ret.msg);
    }
  }
}
