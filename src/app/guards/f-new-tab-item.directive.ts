import {Directive, HostListener, Input} from "@angular/core";
import {Router} from "@angular/router";

@Directive({
  selector: "[app-new-tab-item], [appNewTabItem]",
  standalone: true,
})
export class FNewTabItemDirective {
  @Input() appNewTabItem!: string;

  constructor(private router: Router) {
  }

  @HostListener("click", ["$event"])
  async click(event: MouseEvent): Promise<void> {
    if (event.button === 1 || event.ctrlKey) {
      window.open(this.appNewTabItem, "_blank");
      event.preventDefault();
    } else {
      await this.router.navigate([this.appNewTabItem]);
    }
  }
  @HostListener("auxclick", ["$event"])
  async auxclick(event: MouseEvent): Promise<void> {
    if (event.button === 1) {
      window.open(this.appNewTabItem, "_blank");
      event.preventDefault();
    }
  }
}
