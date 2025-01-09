import {Component, Input, Output, EventEmitter, TemplateRef, ContentChild, AfterContentInit, inject, OnChanges, SimpleChanges} from "@angular/core";
import * as FExtensions from "../../../guards/f-extensions";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {FilterService} from "primeng/api";
import {FilterModel} from "../../../models/common/filter-model";
import {IconField} from "primeng/iconfield";
import {InputText} from "primeng/inputtext";
import {InputIcon} from "primeng/inputicon";

@Component({
  selector: "app-custom-pick-list",
  imports: [CdkDropList, CdkDropListGroup, CdkDrag, NgForOf, NgTemplateOutlet, NgIf, IconField, InputText, InputIcon, NgClass],
  templateUrl: "./custom-pick-list.component.html",
  styleUrl: "./custom-pick-list.component.scss",
  standalone: true,
})
export class CustomPickListComponent implements AfterContentInit, OnChanges {
  @Input() disable: boolean = false;
  @Input() useFilter: boolean = true;
  @Input() ignoreCase: boolean = true;
  @Input() filterMatchMode: "contains" | "startsWith" | "endsWith" | "equals" | "notEquals" | "in" | "lt" | "lte" | "gt" | "gte" = "contains";
  @Input() filterLocale: string | undefined;
  @Input() filterFields: string[] = [];
  @Input() sourceFilterPlaceHolder: string | TemplateRef<HTMLElement> = "";
  @Input() targetFilterPlaceHolder: string | TemplateRef<HTMLElement> = "";
  filterValueSource: string = "";
  filterValueTarget: string = "";
  filteredSourceList: any[] = [];
  filteredTargetList: any[] = [];
  @Output() onSourceFilter: EventEmitter<FilterModel> = new EventEmitter<FilterModel>();
  @Output() onTargetFilter: EventEmitter<FilterModel> = new EventEmitter<FilterModel>();
  @Input() sourceList: any[] = [];
  @Input() targetList: any[] = [];
  @Input() selectedSource: any;
  @Output() selectedSourceChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedTarget: any;
  @Output() selectedTargetChange: EventEmitter<any> = new EventEmitter<any>();
  @ContentChild("sourceItem", { descendants: false }) sourceItemTemplate?: TemplateRef<any>;
  @ContentChild("targetItem", { descendants: false }) targetItemTemplate?: TemplateRef<any>;
  @ContentChild("defTemplate", { descendants: false }) defTemplate!: TemplateRef<any>;
  draggedSource?: any;
  draggedTarget?: any;
  @Output() sourceDropChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() targetDropChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() sourceDragChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() targetDragChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() sourceSelectChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() targetSelectChange: EventEmitter<any> = new EventEmitter<any>();
  filterService = inject(FilterService);
  SOURCE_LIST: number = -1;
  TARGET_LIST: number = 1;
  constructor() {
  }

  ngAfterContentInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["sourceList"]) {
      this.filter(<any[]>this.sourceList, this.SOURCE_LIST);
      this.selectedSource = undefined;
    }
    if (changes["targetList"]) {
      this.filter(<any[]>this.targetList, this.TARGET_LIST);
      this.selectedTarget = undefined;
    }
  }

  onSourceFilterChange(data: any): void {
    const value = (data.target as HTMLInputElement).value;
    this.sourceFilter(value);
  }
  onTargetFilterChange(data: any): void {
    const value = (data.target as HTMLInputElement).value;
    this.targetFilter(value);
  }
  sourceFilter(value: string = ""): void {
    this.filterValueSource = this.ignoreCase ? value.trim().toLocaleLowerCase(this.filterLocale) : value.trim();
    this.filter(<any[]>this.sourceList, this.SOURCE_LIST);
  }
  targetFilter(value: string = ""): void {
    this.filterValueTarget = this.ignoreCase ? value.trim().toLocaleLowerCase(this.filterLocale) : value.trim();
    this.filter(<any[]>this.targetList, this.TARGET_LIST);
  }
  filter(data: any[], listType: number = this.SOURCE_LIST): void {
    const searchFields = this.filterFields.length <= 0 ? [""] : this.filterFields;
    if (listType == this.SOURCE_LIST) {
      if (this.filterValueSource) {
        this.filteredSourceList = this.filterService.filter(data, searchFields, this.filterValueSource, this.filterMatchMode, this.filterLocale);
      } else {
        this.filteredSourceList = [...this.sourceList];
      }
      this.onSourceFilter.emit({ query: this.filterValueSource, value: this.filteredSourceList });
    } else {
      if (this.filterValueTarget) {
        this.filteredTargetList = this.filterService.filter(data, searchFields, this.filterValueTarget, this.filterMatchMode, this.filterLocale);
      } else {
        this.filteredTargetList = [...this.targetList];
      }
      this.onTargetFilter.emit({ query: this.filterValueTarget, value: this.filteredTargetList });
    }
  }
  getDropIndexes(fromIndex: number, toIndex: number, listType: number, isTransfer: boolean, data: any[] | any): { previousIndex: number, currentIndex: number } {
    let previousIndex: number;
    let currentIndex: number;
    if (listType == this.SOURCE_LIST) {
      previousIndex = isTransfer ? (this.filterValueTarget ? FExtensions.findIndexInList(data, this.targetList) : fromIndex) : this.filterValueSource ? FExtensions.findIndexInList(data, this.sourceList) : fromIndex;
      currentIndex = this.filterValueSource ? this.findFilteredCurrentIndex(<any[]>this.filteredSourceList, toIndex, this.sourceList) : toIndex;
    } else {
      previousIndex = isTransfer ? (this.filterValueSource ? FExtensions.findIndexInList(data, this.sourceList) : fromIndex) : this.filterValueTarget ? FExtensions.findIndexInList(data, this.targetList) : fromIndex;
      currentIndex = this.filterValueTarget ? this.findFilteredCurrentIndex(<any[]>this.filteredTargetList, toIndex, this.targetList) : toIndex;
    }

    return { previousIndex, currentIndex };
  }
  findFilteredCurrentIndex(filteredList: any[], index: number, list: any): number {
    if (filteredList.length == index) {
      return FExtensions.findIndexInList(filteredList[index - 1], list);
    } else {
      return FExtensions.findIndexInList(filteredList[index], list);
    }
  }
  onDrop(event: CdkDragDrop<string[]>, listType: number): void {
    const isTransfer = event.previousContainer !== event.container;
    console.log(event.item.data);
    const dropIndexes = this.getDropIndexes(event.previousIndex, event.currentIndex, listType, isTransfer, event.item.data);
    if (listType == this.SOURCE_LIST) {
      if (isTransfer) {
        transferArrayItem(event.previousContainer.data, event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
        if (this.filteredTargetList) this.filteredTargetList.splice(event.previousIndex, 1);
        if (this.draggedTarget === this.selectedTarget) {
          this.targetSelect(undefined);
        }
        this.filter(<any[]>this.sourceList, this.SOURCE_LIST);
      } else {
        moveItemInArray(event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
        this.filter(<any[]>this.sourceList, this.SOURCE_LIST);
      }
    } else {
      if (isTransfer) {
        transferArrayItem(event.previousContainer.data, event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
        if (this.filteredSourceList) this.filteredSourceList.splice(event.previousIndex, 1);
        if (this.draggedSource === this.selectedSource) {
          this.sourceSelect(undefined);
        }
        this.filter(<any[]>this.targetList, this.TARGET_LIST);
      } else {
        moveItemInArray(event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
        this.filter(<any[]>this.targetList, this.TARGET_LIST);
      }
    }
  }
  toTargetDrop(data: any): void {
    const isTransfer = data.previousContainer !== data.container;
    const dropIndex = this.getDropIndexes(data.previousIndex, data.currentIndex, this.SOURCE_LIST, isTransfer, data.item.data);
    if (isTransfer) {
      moveItemInArray(data.container.data, dropIndex.previousIndex, dropIndex.currentIndex);
      this.filter(<any[]>this.sourceList, this.SOURCE_LIST);
    } else {
      transferArrayItem(data.previousContainer.data, data.container.data, dropIndex.previousIndex, dropIndex.currentIndex);
      if (this.filteredTargetList) this.filteredTargetList.splice(data.previousIndex, 1);
      if (this.draggedTarget === this.selectedTarget) {
        this.targetSelect(undefined);
      }
      this.filter(<any[]>this.sourceList, this.SOURCE_LIST);
    }
    this.draggedTarget = undefined;
    this.sourceDropChange.emit(data);
  }
  toSourceDrop(data: any): void {
    const isTransfer = data.previousContainer === data.container;
    const dropIndex = this.getDropIndexes(data.previousIndex, data.currentIndex, this.TARGET_LIST, isTransfer, data.item.data);
    if (isTransfer) {
      moveItemInArray(data.container.data, dropIndex.previousIndex, dropIndex.currentIndex);
      this.filter(<any[]>this.targetList, this.TARGET_LIST);
    } else {
      transferArrayItem(data.previousContainer.data, data.container.data, dropIndex.previousIndex, dropIndex.currentIndex);
      if (this.filteredSourceList) this.filteredSourceList.splice(data.previousIndex, 1);
      if (this.draggedSource === this.selectedSource) {
        this.sourceSelect(undefined);
      }
      this.filter(<any[]>this.targetList, this.TARGET_LIST);
    }
    this.draggedSource = undefined;
    this.targetDropChange.emit(data);
  }
  sourceDrag(event: any, data: any): void {
    this.draggedSource = data;
    this.sourceDragChange.emit(data);
  }
  targetDrag(event: any, data: any): void {
    this.draggedTarget = data;
    this.targetDragChange.emit(data);
  }
  sourceSelect(source: any): void {
    if (this.disable) {
      return;
    }

    if (source === this.selectedSource) {
      this.selectedSource = undefined;
      this.selectedSourceChange.emit(undefined);
      this.sourceSelectChange.emit(undefined);
    } else {
      this.selectedSource = source;
      this.selectedSourceChange.emit(source);
      this.sourceSelectChange.emit(source);
    }
  }
  targetSelect(target: any): void {
    if (this.disable) {
      return;
    }

    if (target === this.selectedTarget) {
      this.selectedTarget = undefined;
      this.selectedTargetChange.emit(undefined);
      this.targetSelectChange.emit(undefined);
    } else {
      this.selectedTarget = target;
      this.selectedTargetChange.emit(target);
      this.targetSelectChange.emit(target);
    }
  }
  haveSelected(div?: HTMLDivElement | { data: any, div: HTMLDivElement }): boolean {
    if (div instanceof HTMLDivElement) {
      return div.classList.contains(this.customPickBoxSelected);
    } else {
      return div?.div?.classList?.contains(this.customPickBoxSelected) == true;
    }
  }
  addSelected(div?: HTMLDivElement | { data: any, div: HTMLDivElement }): void {
    if (div instanceof HTMLDivElement) {
      div.classList.add(this.customPickBoxSelected);
    } else {
      div?.div?.classList?.add(this.customPickBoxSelected);
    }
  }
  removeSelected(div?: HTMLDivElement | {data: any, div: HTMLDivElement }): void {
    if (div instanceof HTMLDivElement) {
      div.classList.remove(this.customPickBoxSelected);
    } else {
      div?.div?.classList?.remove(this.customPickBoxSelected);
    }
  }
  isSelectedSource(data: any): string[] {
    const ret: string[] = [];
    if (this.selectedSource === data) {
      ret.push(this.customPickBoxSelected);
    }
    if (this.disable) {
      ret.push(this.pDisable);
    }
    return ret;
  }
  isSelectedTarget(data: any): string[] {
    const ret: string[] = [];
    if (this.selectedTarget === data) {
      ret.push(this.customPickBoxSelected);
    }
    if (this.disable) {
      ret.push(this.pDisable);
    }
    return ret;
  }
  get visibleSource(): any[] {
    if (this.filteredSourceList && this.filteredSourceList.length > 0) {
      return this.filteredSourceList;
    }

    return this.sourceList;
  }
  get visibleTarget(): any[] {
    if (this.filteredTargetList && this.filteredTargetList.length > 0) {
      return this.filteredTargetList;
    }

    return this.targetList;
  }

  get customPickBoxSelected(): string {
    return "custom-pick-box-selected";
  }
  get pDisable(): string {
    return "p-disabled";
  }

  get sourceTemplateOutlet(): TemplateRef<any> {
    return this.sourceItemTemplate ? this.sourceItemTemplate : this.defTemplate;
  }
  sourceTemplateOutletContext(data: any): any {
    return { $implicit: data };
  }
  get targetTemplateOutlet(): TemplateRef<any> {
    return this.targetItemTemplate ? this.targetItemTemplate : this.defTemplate;
  }
  targetTemplateOutletContext(data: any): any {
    return { $implicit: data };
  }

	protected readonly ellipsis = FExtensions.ellipsis;
}
