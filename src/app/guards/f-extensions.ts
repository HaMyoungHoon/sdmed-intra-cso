import {stringToUserStatus, UserStatus} from "../models/rest/user-status";
import {Table} from "primeng/table";
import {SortEvent} from "primeng/api";
import {RestResult} from "../models/common/rest-result";

export function dToMon(date: Date): string {
  let ret = date.getMonth() + 1;
  return ret >= 10 ? `${ret}` : `0${ret}`;
}
export function dToD(date: Date): string {
  let ret = date.getDate();
  return ret >= 10 ? `${ret}` : `0${ret}`;
}
export function dToH(date: Date): string {
  let ret = date.getHours();
  return ret >= 10 ? `${ret}` : `0${ret}`;
}
export function dToMin(date: Date): string {
  let ret = date.getMinutes();
  return ret >= 10 ? `${ret}` : `0${ret}`;
}
export function dToS(date: Date): string {
  let ret = date.getSeconds();
  return ret >= 10 ? `${ret}` : `0${ret}`;
}
export function dateToYearFullString(date?: Date): string {
  if (date == null) {
    return "????-??-?? ??:??:??";
  }

  return `${date.getFullYear()}-${dToMon(date)}-${dToD(date)} ${dToH(date)}:${dToMin(date)}:${dToS(date)}`;
}

export function dateToMonthFullString(date?: Date): string {
  if (date == null) {
    return "????-??-?? ??:??:??";
  }
  return `${dToMon(date)}-${dToD(date)} ${dToH(date)}:${dToMin(date)}:${dToS(date)}`;
}
export function stringToDate(dateString?: string): Date | undefined {
  if (dateString == null) {
    return undefined;
  }

  return new Date(dateString);
}

export function getSeverity(data?: UserStatus): any {
  if (typeof(data) == "string") {
    data = stringToUserStatus(data);
  }
  switch (data) {
    case UserStatus.None: return "info";
    case UserStatus.Live: return "success";
    case UserStatus.Stop: return "warning";
    case UserStatus.Delete: return "warning";
    case UserStatus.Expired: return "danger";
  }

  return undefined;
}

export function tryCatch<T>(fn: () => T, onError?: (e: any) => void): T | null {
  try {
    return fn();
  } catch (e: any) {
    if (onError) {
      onError(e);
    }

    return null;
  }
}
export async function tryCatchAsync<T>(fn: () => Promise<T>, onError?: (e: any) => void): Promise<T | null> {
  try {
    return await fn();
  } catch (e: any) {
    if (onError) {
      onError(e);
    }
    return null;
  }
}
export async function restTry<T>(fn: () => Promise<RestResult<T>>, onError?: (e: any) => void): Promise<RestResult<T>> {
  try {
    return await fn();
  } catch (e: any) {
    if (onError) {
      const error = e.error as RestResult<T>;
      if (error) {
        return error;
      } else {
        onError(e.message);
      }
    }
    return new RestResult<T>().default
  }
}

export function applyClass<T>(obj: T, fn: (obj: T) => void): T {
  fn(obj);
  return obj;
}
export function filterTable(table: Table, data: any, options: string): void {
  table.filterGlobal(data.target.value, options);
}

export function sortTableData(event: any): void {
  event.data.sort((data1: any[], data2: any[]) => {
    let value1 = data1[event.field];
    let value2 = data2[event.field];
    let result: number;
    if (value1 == null && value2 != null) result = -1;
    else if (value1 != null && value2 == null) result = 1;
    else if (value1 == null && value2 == null) result = 0;
    else if (typeof value1 === "string" && typeof value2 === "string") result = value1.localeCompare(value2);
    else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

    return event.order * result;
  });
}

export function customSort<T>(event: SortEvent, isSorted: boolean | null, table: Table, initValue: T[], viewValue: T[]): void {
  if (isSorted == null) {
    isSorted = true;
    sortTableData(event);
  } else if (isSorted) {
    isSorted = false;
    sortTableData(event);
  } else if (!isSorted) {
    isSorted = null;
    if (initValue) {
      viewValue = [...initValue];
    }
    table.reset();
  }
}

export function ellipsis(data?: string, length: number = 20): string {
  if (data == null) {
    return "";
  }
  if (data.length > length) {
    return data.substring(0, length) + "...";
  }

  return data;
}
