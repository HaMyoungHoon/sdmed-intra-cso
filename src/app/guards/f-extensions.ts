import {stringToUserStatus, UserStatus} from "../models/rest/user-status";

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

export function applyClass<T>(obj: T, fn: (obj: T) => void): T {
  fn(obj);
  return obj;
}
