import { Component } from "@angular/core";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {TableDialogColumn} from "../../../models/common/table-dialog-column";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {NgForOf, NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: "app-table-dialog",
  standalone: true,
  imports: [
    TableModule,
    Button,
    NgForOf,
    NgIf,
    TranslatePipe
  ],
  templateUrl: "./table-dialog.component.html",
  styleUrl: "./table-dialog.component.scss"
})
export class TableDialogComponent {
  cols: TableDialogColumn[];
  data: any[];
  selectedData: any;
  selectable: "single" | "multiple" | null | undefined;

  constructor(private ref: DynamicDialogRef, private dialogService: DialogService) {
    const dlg = this.dialogService.getInstance(ref);
    this.cols = dlg.data.cols;
    this.data = dlg.data.tableData;
    this.selectable = dlg.data.selectable;
  }

  ellipsis(data: string): string {
    if (data.length > 20) {
      return data.substring(0, 20) + "...";
    }

    return data;
  }
  select(): void {
    console.log(this.selectedData);
    this.ref.close(this.selectedData);
  }
  get selectionMode(): "single" | "multiple" | null | undefined {
    return this.selectable
  }
  selectChange(): void {
  }
  get isVisibleSelect(): boolean {
    return !(this.selectable == null || this.selectable == undefined);
  }
  get disableSelect(): boolean {
    if (this.selectedData == null) {
      return true;
    }

    return false;
  }
}
