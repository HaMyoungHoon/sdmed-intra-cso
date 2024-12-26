import {ChangeDetectorRef, Component, signal, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {haveRole, UserRole} from "../../../../models/rest/user/user-role";
import {EdiDueDateService} from "../../../../services/rest/edi-due-date.service";
import * as FExtensions from "../../../../guards/f-extensions"
import {EDIPharmaDueDateModel} from "../../../../models/rest/edi/edi-pharma-due-date-model";
import {CalendarOptions, DateSelectArg, DatesSetArg, EventApi, EventChangeArg, EventClickArg} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {PharmaModel} from "../../../../models/rest/pharma/pharma-model";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {LangChangeEvent} from "@ngx-translate/core";


@Component({
  selector: "app-edi-due-date",
  templateUrl: "./edi-due-date.component.html",
  styleUrl: "./edi-due-date.component.scss",
  standalone: false
})
export class EdiDueDateComponent extends FComponentBase {
  @ViewChild("calendar") calendar!: FullCalendarComponent;
  viewModel: EDIPharmaDueDateModel[] = [];
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "",
    },
    initialView: "dayGridMonth",
    weekends: true,
    editable: true,
    selectable: true,
    dayMaxEvents: true,
    locale: "ko",
    timeZone: "UTC",
    datesSet: this.datesSet.bind(this),
    select: this.dateSelect.bind(this),
    eventClick: this.eventClick.bind(this),
    eventsSet: this.eventSet.bind(this),
    eventChange: this.eventChange.bind(this),
    contentHeight: "800px",
  });
  pharmaSelectVisible: boolean = false;
  selectedDate?: Date;
  selectedPharma: PharmaModel[] = [];
  ablePharmaList: PharmaModel[] = [];
  constructor(private thisService: EdiDueDateService, private cd: ChangeDetectorRef) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger, UserRole.Employee, UserRole.EdiChanger));
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.calendarOptions.update((options) => ({
        ...options,
        locale: event.lang
      }));
    });
  }

  override async ngInit(): Promise<void> {
    await this.getList();
  }

  async getList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(FExtensions.dateToYYYYMMdd(this.calendar.getApi().getDate())),
      e => this.fDialogService.error("getList", e));
    this.setLoading(false);
    if (ret.result) {
      this.calendar.getApi().removeAllEvents();
      this.viewModel = ret.data ?? [];
      this.viewModel.forEach(x => {
        this.addEvent(x);
      });
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }
  async getListRange(startDate: Date, endDate: Date): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getListRange(FExtensions.dateToYYYYMMdd(startDate), FExtensions.dateToYYYYMMdd(endDate)),
      e => this.fDialogService.error("getListRange", e));
    this.setLoading(false);
    if (ret.result) {
      this.calendar.getApi().removeAllEvents();
      this.viewModel = ret.data ?? [];
      this.viewModel.forEach(x => {
        this.addEvent(x);
      });
      return;
    }
    this.fDialogService.warn("getListRange", ret.msg);
  }
  async getAblePharma(date: Date): Promise<boolean> {
    this.setLoading();
    this.selectedDate = date;
    const ret = await FExtensions.restTry(async() => await this.thisService.getListPharmaAble(FExtensions.dateToYYYYMMdd(date)),
      e => this.fDialogService.error("getAblePharma", e));
    this.setLoading(false);
    if (ret.result) {
      this.ablePharmaList = ret.data ?? [];
      return true;
    }
    this.fDialogService.warn("getAblePharma", ret.msg);
    return false;
  }
  async dateAdd(pharmaPK: string, date: Date): Promise<EDIPharmaDueDateModel | undefined> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.postData(pharmaPK, FExtensions.dateToYYYYMMdd(date)),
      e => this.fDialogService.error("dateAdd", e));
    this.setLoading(false);
    if (ret.result) {
      return ret.data;
    }
    this.fDialogService.warn("dateAdd", ret.msg);
    return undefined;
  }
  async dateListAdd(pharmaPK: string[], date: Date): Promise<EDIPharmaDueDateModel[]> {
    if (pharmaPK.length <= 0) {
      return [];
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.postList(pharmaPK, FExtensions.dateToYYYYMMdd(date)),
      e => this.fDialogService.error("dateListAdd", e));
    this.setLoading(false);
    if (ret.result) {
      return ret.data ?? [];
    }
    this.fDialogService.warn("dateListAdd", ret.msg);
    return [];
  }
  async dateModify(thisPK: string, date: Date | null): Promise<boolean> {
    if (date == null) {
      return false;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.putData(thisPK, FExtensions.dateToYYYYMMdd(date)),
      e => this.fDialogService.error("dateModify", e));
    this.setLoading(false);
    if (ret.result) {
      return true;
    }
    this.fDialogService.warn("dateModify", ret.msg);
    return false;
  }
  async dateDelete(pharmaPK: string, date: Date | null): Promise<boolean> {
    if (date == null) {
      return false;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.deleteData(pharmaPK, FExtensions.dateToYYYYMMdd(date)),
      e => this.fDialogService.error("dateDelete", e));
    this.setLoading(false);
    if (ret.result) {
      return true;
    }
    this.fDialogService.warn("dateDelete", ret.msg);
    return false;
  }

  async datesSet(datesSetArg: DatesSetArg): Promise<void> {
    if (this.haveRole) {
      await this.getListRange(datesSetArg.start, datesSetArg.end);
    }
  }
  async dateSelect(selectInfo: DateSelectArg): Promise<void> {
    if (!haveRole(this.myRole, Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger, UserRole.EdiChanger))) {
      return;
    }
    if (!await this.getAblePharma(selectInfo.start)) {
      return;
    }

    this.selectedDate = selectInfo.start;
    this.pharmaSelectVisible = true;
  }
  async eventClick(clickInfo: EventClickArg): Promise<void> {
    if (!haveRole(this.myRole, Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger, UserRole.EdiChanger))) {
      return;
    }
    if (confirm(`delete ${clickInfo.event.title} / ${clickInfo.event.startStr}`)) {
      if (await this.dateDelete(clickInfo.event.extendedProps["pharmaPK"], clickInfo.event.start)) {
        clickInfo.event.remove();
      }
    }
  }
  async eventSet(events: EventApi[]): Promise<void> {
    this.cd.detectChanges();
  }
  async eventChange(eventChange: EventChangeArg): Promise<void> {
    if (!haveRole(this.myRole, Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger, UserRole.EdiChanger))) {
      return;
    }
    if (await this.dateModify(eventChange.event.extendedProps["thisPK"], eventChange.event.start)) {

    } else {
      eventChange.revert();
    }
  }

  async pharmaDrawerOnHide(): Promise<void> {
    this.ablePharmaList = [];
    this.selectedPharma = [];
    this.selectedDate = undefined;
  }
  async pharmaDrawerClose(): Promise<void> {
    this.pharmaSelectVisible = false;
    if (this.selectedDate == null) {
      return;
    }

    const buff = await this.dateListAdd(this.selectedPharma.map(x => x.thisPK), this.selectedDate);
    this.ablePharmaList = [];
    this.selectedPharma = [];
    this.selectedDate = undefined;
    if (buff.length > 0) {
      buff.forEach(x => this.addEvent(x));
    }
  }

  addEvent(dueDateModel: EDIPharmaDueDateModel): void {
    this.calendar.getApi().addEvent({
      title: dueDateModel.orgName,
      start: FExtensions.stringToDate(`${dueDateModel.year}-${dueDateModel.month}-${dueDateModel.day}`),
      allDay: true,
      extendedProps: {
        "thisPK": dueDateModel.thisPK,
        "pharmaPK": dueDateModel.pharmaPK
      }
    });
  }
}
