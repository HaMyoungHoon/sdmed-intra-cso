import {Component, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {DashboardService} from "../../../../services/rest/dashboard.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import {ChartData, ChartDataset} from "chart.js";
import {responseTypeToResponseTypeDesc, stringToPropertyBackgroundName, stringToPropertyHoverBackgroundName} from "../../../../models/rest/requst/response-type";
import {DatePicker} from "primeng/datepicker";

@Component({
  selector: "app-chart-view",
  templateUrl: "./chart-view.component.html",
  styleUrl: "./chart-view.component.scss",
  standalone: false,
})
export class ChartViewComponent extends FComponentBase {
  @ViewChild("startDatePicker") startDatePicker !: DatePicker;
  @ViewChild("endDatePicker") endDatePicker !: DatePicker;
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
  startDate: Date = FExtensions.plusDays(new Date(), -31);
  endDate: Date = new Date();
  constructor(private thisService: DashboardService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.Employee));
    this.layoutInit();
  }
  override async ngInit(): Promise<void> {
    await this.getChartData1();
    await this.getChartData2();
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
    const startDate = FExtensions.dateToYYYYMMdd(this.startDate);
    const endDate = FExtensions.dateToYYYYMMdd(this.endDate);
    const ret = await FExtensions.restTry(async() => await this.thisService.getCountOfResponseType(startDate, endDate),
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
    const startDate = FExtensions.dateToYYYYMMdd(this.startDate);
    const endDate = FExtensions.dateToYYYYMMdd(this.endDate);
    const ret = await FExtensions.restTry(async() => await this.thisService.getTop10RequestUser(startDate, endDate),
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

    const diffDay = FExtensions.calcDateDiffDay(this.startDate, this.endDate);
    if (diffDay > 366) {
      this.endDate.setTime(this.startDate.getTime() + 365 * 1000 * 24 * 60 * 60);
      this.endDatePicker.updateInputfield();
    }
  }
  async endDateChange(data: any): Promise<void> {
    if (this.startDate.getTime() > this.endDate.getTime()) {
      const buff = new Date(this.startDate);
      this.startDate = new Date(this.endDate);
      this.endDate = new Date(buff);
    }

    const diffDay = FExtensions.calcDateDiffDay(this.startDate, this.endDate);
    if (diffDay > 366) {
      this.startDate.setTime(this.endDate.getTime() - 365 * 1000 * 24 * 60 * 60);
      this.startDatePicker.updateInputfield();
    }
  }

  randomBackgroundColor(): string[] {
    const documentStyle = getComputedStyle(document.documentElement);
    return [
      documentStyle.getPropertyValue("--p-blue-400"),
      documentStyle.getPropertyValue("--p-orange-400"),
      documentStyle.getPropertyValue("--p-green-400"),
      documentStyle.getPropertyValue("--p-red-400"),
      documentStyle.getPropertyValue("--p-gray-400"),
      documentStyle.getPropertyValue("--p-cyan-400"),
      documentStyle.getPropertyValue("--p-pink-400"),
      documentStyle.getPropertyValue("--p-indigo-400"),
      documentStyle.getPropertyValue("--p-teal-400"),
      documentStyle.getPropertyValue("--p-purple-400"),
    ];
  }
  randomHoverBackgroundColor(): string[] {
    const documentStyle = getComputedStyle(document.documentElement);
    return [
      documentStyle.getPropertyValue("--p-blue-200"),
      documentStyle.getPropertyValue("--p-orange-200"),
      documentStyle.getPropertyValue("--p-green-200"),
      documentStyle.getPropertyValue("--p-red-200"),
      documentStyle.getPropertyValue("--p-gray-200"),
      documentStyle.getPropertyValue("--p-cyan-200"),
      documentStyle.getPropertyValue("--p-pink-200"),
      documentStyle.getPropertyValue("--p-indigo-200"),
      documentStyle.getPropertyValue("--p-teal-200"),
      documentStyle.getPropertyValue("--p-purple-200"),
    ];
  }
  randomBorderColor(): string[] {
    const documentStyle = getComputedStyle(document.documentElement);
    return [
      documentStyle.getPropertyValue("--p-blue-700"),
      documentStyle.getPropertyValue("--p-orange-700"),
      documentStyle.getPropertyValue("--p-green-700"),
      documentStyle.getPropertyValue("--p-red-700"),
      documentStyle.getPropertyValue("--p-gray-700"),
      documentStyle.getPropertyValue("--p-cyan-700"),
      documentStyle.getPropertyValue("--p-pink-700"),
      documentStyle.getPropertyValue("--p-indigo-700"),
      documentStyle.getPropertyValue("--p-teal-700"),
      documentStyle.getPropertyValue("--p-purple-700"),
    ];
  }
}
