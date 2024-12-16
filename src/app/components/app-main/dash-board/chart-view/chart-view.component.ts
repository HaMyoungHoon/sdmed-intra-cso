import {Component, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {DashboardService} from "../../../../services/rest/dashboard.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import {calcDateDiffDay, dateToMonthYYYYMMdd, plusDays, restTry} from "../../../../guards/f-extensions";
import {ChartData, ChartDataset} from "chart.js";
import {responseTypeToResponseTypeDesc, stringToPropertyBackgroundName, stringToPropertyHoverBackgroundName} from "../../../../models/rest/requst/response-type";
import {Calendar} from "primeng/calendar";

@Component({
  selector: "app-chart-view",
  templateUrl: "./chart-view.component.html",
  styleUrl: "./chart-view.component.scss",
  standalone: false,
})
export class ChartViewComponent extends FComponentBase {
  @ViewChild("startCalendar") startCalendar !: Calendar;
  @ViewChild("endCalendar") endCalendar !: Calendar;
  chartOption1: any;
  chartData1: ChartData<"pie", number[]> = new class implements ChartData<"pie", number[]> {
    datasets: ChartDataset<"pie", number[]>[] = [];
    labels: string[] = [];
    xLabels: string[] = [];
    yLabels: string[] = [];
  };
  chartOption2: any;
  chartData2: ChartData<"bar", number[]> = new class implements ChartData<"bar", number[]> {
    datasets: ChartDataset<"bar", number[]>[] = [];
    labels: string[] = [];
    xLabels: string[] = [];
    yLabels: string[] = [];
  };
  startDate: Date = plusDays(new Date(), -31);
  endDate: Date = new Date();
  constructor(private thisService: DashboardService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
    this.layoutInit();
  }
  override async ngInit(): Promise<void> {
    if (this.haveRole) {
      await this.getChartData1();
      await this.getChartData2();
    }
  }
  layoutInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    this.chartOption1 = {
      plugins: {
        legend: {
          labels: {
            userPointStyle: true,
            color: textColor
          }
        }
      }
    };
    this.chartOption2 = {
      plugins: {
        legend: {
          labels: {
            fontColor: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  async getChartData1(): Promise<void> {
    this.setLoading();
    const documentStyle = getComputedStyle(document.documentElement);
    const startDate = dateToMonthYYYYMMdd(this.startDate);
    const endDate = dateToMonthYYYYMMdd(this.endDate);
    const ret = await restTry(async() => await this.thisService.getCountOfResponseType(startDate, endDate),
      e => this.fDialogService.error("getChartData1", e));
    this.setLoading(false);
    if (ret.result) {
      const buff = ret.data ?? [];
      this.chartData1 = {
        labels: buff.map(x => responseTypeToResponseTypeDesc(x.responseType)),
        datasets: [
          {
            data: buff.map(x => x.count),
            backgroundColor: buff.map(x => documentStyle.getPropertyValue(stringToPropertyBackgroundName[x.responseType])),
            hoverBackgroundColor: buff.map(x => documentStyle.getPropertyValue(stringToPropertyHoverBackgroundName[x.responseType])),
          }
        ]
      };
      return;
    }
    this.fDialogService.warn("getChartData1", ret.msg);
  }
  async getChartData2(): Promise<void> {
    this.setLoading();
    const startDate = dateToMonthYYYYMMdd(this.startDate);
    const endDate = dateToMonthYYYYMMdd(this.endDate);
    const ret = await restTry(async() => await this.thisService.getTop10RequestUser(startDate, endDate),
      e => this.fDialogService.error("getChartData2", e));
    this.setLoading(false);
    if (ret.result) {
      const buff = ret.data ?? [];
      this.chartData2 = {
        labels: buff.map(x => x.requestUserID),
        datasets: [
          {
            data: buff.map(x => x.count),
            label: "count",
            backgroundColor: this.randomBackgroundColor(),
            hoverBackgroundColor: this.randomHoverBackgroundColor(),
            borderColor: this.randomBorderColor(),
            borderWidth: 1
          }
        ]
      }
      return;
    }
    this.fDialogService.warn("getChartData2", ret.msg);
  }

  async refreshData(): Promise<void> {
    if (this.haveRole) {
      await this.getChartData1();
      await this.getChartData2();
    }
  }
  async startDateChange(data: any): Promise<void> {
    if (this.startDate.getTime() > this.endDate.getTime()) {
      const buff = new Date(this.startDate);
      this.startDate = new Date(this.endDate);
      this.endDate = new Date(buff);
    }

    const diffDay = calcDateDiffDay(this.startDate, this.endDate);
    if (diffDay > 366) {
      this.endDate.setTime(this.startDate.getTime() + 365 * 1000 * 24 * 60 * 60);
      this.endCalendar.updateInputfield();
    }
  }
  async endDateChange(data: any): Promise<void> {
    if (this.startDate.getTime() > this.endDate.getTime()) {
      const buff = new Date(this.startDate);
      this.startDate = new Date(this.endDate);
      this.endDate = new Date(buff);
    }

    const diffDay = calcDateDiffDay(this.startDate, this.endDate);
    if (diffDay > 366) {
      this.startDate.setTime(this.endDate.getTime() - 365 * 1000 * 24 * 60 * 60);
      this.startCalendar.updateInputfield();
    }
  }

  randomBackgroundColor(): string[] {
    const documentStyle = getComputedStyle(document.documentElement);
    return [
      documentStyle.getPropertyValue("--blue-400"),
      documentStyle.getPropertyValue("--orange-400"),
      documentStyle.getPropertyValue("--green-400"),
      documentStyle.getPropertyValue("--red-400"),
      documentStyle.getPropertyValue("--gray-400"),
      documentStyle.getPropertyValue("--cyan-400"),
      documentStyle.getPropertyValue("--pink-400"),
      documentStyle.getPropertyValue("--indigo-400"),
      documentStyle.getPropertyValue("--teal-400"),
      documentStyle.getPropertyValue("--purple-400"),
    ];
  }
  randomHoverBackgroundColor(): string[] {
    const documentStyle = getComputedStyle(document.documentElement);
    return [
      documentStyle.getPropertyValue("--blue-200"),
      documentStyle.getPropertyValue("--orange-200"),
      documentStyle.getPropertyValue("--green-200"),
      documentStyle.getPropertyValue("--red-200"),
      documentStyle.getPropertyValue("--gray-200"),
      documentStyle.getPropertyValue("--cyan-200"),
      documentStyle.getPropertyValue("--pink-200"),
      documentStyle.getPropertyValue("--indigo-200"),
      documentStyle.getPropertyValue("--teal-200"),
      documentStyle.getPropertyValue("--purple-200"),
    ];
  }
  randomBorderColor(): string[] {
    const documentStyle = getComputedStyle(document.documentElement);
    return [
      documentStyle.getPropertyValue("--blue-700"),
      documentStyle.getPropertyValue("--orange-700"),
      documentStyle.getPropertyValue("--green-700"),
      documentStyle.getPropertyValue("--red-700"),
      documentStyle.getPropertyValue("--gray-700"),
      documentStyle.getPropertyValue("--cyan-700"),
      documentStyle.getPropertyValue("--pink-700"),
      documentStyle.getPropertyValue("--indigo-700"),
      documentStyle.getPropertyValue("--teal-700"),
      documentStyle.getPropertyValue("--purple-700"),
    ];
  }
}
