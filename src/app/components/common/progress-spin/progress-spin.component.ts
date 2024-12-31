import {Component, Input} from "@angular/core";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgIf} from "@angular/common";

@Component({
  selector: "app-progress-spin",
  imports: [
    ProgressSpinnerModule,
    NgIf
  ],
  templateUrl: "./progress-spin.component.html",
  styleUrl: "./progress-spin.component.scss",
  standalone: true
})
export class ProgressSpinComponent {
  @Input() isLoading?: boolean;
  constructor() {
  }
}
