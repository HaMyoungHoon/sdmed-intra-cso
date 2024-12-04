import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {MedicineService} from "../../../../services/rest/medicine.service";

@Component({
  selector: "app-medicine-list",
  templateUrl: "./medicine-list.component.html",
  styleUrl: "./medicine-list.component.scss",
  standalone: false,
})
export class MedicineListComponent extends FComponentBase {
  constructor(private medicineService: MedicineService) {
    super();
  }

  override async ngInit(): Promise<void> {

  }
}
