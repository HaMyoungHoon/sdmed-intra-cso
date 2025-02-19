import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgIf} from "@angular/common";
import * as FExtensions from "../../../guards/f-extensions";
import * as FConstants from "../../../guards/f-constants";
import * as FAmhohwa from "../../../guards/f-amhohwa";

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
export class ProgressSpinComponent implements OnChanges {
  @Input() isLoading?: boolean;
  @Input() randomLoading?: boolean;
  imageSrc: string = "";
  constructor() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isLoading"] && this.isLoading) {
      this.imageSrc = this.getRandomImage();
    }
  }

  get isRandomLoading(): boolean {
    return this.randomLoading == false;
  }

  getRandomImage(): string {
    const numberArray = FExtensions.getLocalImageArray();
    const rand = FAmhohwa.getRandom(numberArray.length);
    return FConstants.ASSETS_LOADING_IMAGE[numberArray[rand]];
  }
}
