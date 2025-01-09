import {UserStatus} from "../models/rest/user/user-status";
import {Table} from "primeng/table";
import {SortEvent} from "primeng/api";
import {RestResult} from "../models/common/rest-result";
import * as FContentsType from "./f-contents-type";
import {ResponseType} from "../models/rest/requst/response-type";
import {EDIState} from "../models/rest/edi/edi-state";
import {BlobUploadModel} from "../models/rest/blob-upload-model";
import * as FAmhohwa from "./f-amhohwa";
import * as FConstants from "./f-constants";
import {QnAReplyFileModel} from "../models/rest/qna/qna-reply-file-model";
import {UploadFileBuffModel} from "../models/common/upload-file-buff-model";
import {QnAState} from "../models/rest/qna/qna-state";
import {QnAFileModel} from "../models/rest/qna/qna-file-model";
import {FileViewModel} from "../models/rest/file-view-model";
import {EDIUploadFileModel} from "../models/rest/edi/edi-upload-file-model";
import {PDFDocument, rgb} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {AddTextOptionModel} from "../models/common/add-text-option-model";
import {UserFileModel} from "../models/rest/user/user-file-model";
import {BlobStorageInfoModel} from "../models/rest/blob-storage-info-model";

export type voidFunc = () => void;
export type anyFunc = (x: any) => void;

export function numberWithCommas(data: string): string {
  return data.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
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
export function currentDateYYYYMMdd(): string {
  const date = new Date();

  return `${date.getFullYear()}${dToMon(date)}${dToD(date)}`;
}
export function dateToYearFullString(date?: Date | null | string): string {
  if (date == null) {
    return "????-??-?? ??:??:??";
  }
  if (typeof date == "string") {
    date = stringToDate(date);
  }

  return `${date.getFullYear()}-${dToMon(date)}-${dToD(date)} ${dToH(date)}:${dToMin(date)}:${dToS(date)}`;
}
export function dateToMonthFullString(date?: Date): string {
  if (date == null) {
    return "??-?? ??:??:??";
  }
  return `${dToMon(date)}-${dToD(date)} ${dToH(date)}:${dToMin(date)}:${dToS(date)}`;
}
export function dateToYYYYMMdd(date?: Date | null | string): string {
  if (date == null) {
    return "????-??-??"
  }
  if (typeof(date) == "string") {
    date = stringToDate(date);
  }

  return `${date.getFullYear()}-${dToMon(date)}-${dToD(date)}`;
}
export function dateToMMdd(date?: Date | null | string): string {
  if (date == null) {
    return "??-??"
  }
  if (typeof(date) == "string") {
    date = stringToDate(date);
  }

  return `${dToMon(date)}-${dToD(date)}`;
}
export function calcDateDiffDay(startDate: Date, endDate: Date): number {
  const diffMs = endDate.getTime() - startDate.getTime();
  const msToDay = 1000 * 60 * 60 * 24;
  return Math.floor(diffMs / msToDay);
}

export function stringToDate(dateString?: string): Date {
  if (dateString == null) {
    return new Date();
  }

  return new Date(dateString);
}
export function plusDays(targetDate: Date, days: number): Date {
  const ret = new Date(targetDate);
  ret.setDate(ret.getDate() + days);
  return ret;
}
export function plusMonths(targetDate: Date, months: number): Date {
  const ret = new Date(targetDate);
  ret.setMonth(ret.getMonth() + months);
  return ret;
}

export function getResponseTypeSeverity(data?: ResponseType): any {
  switch (data) {
    case ResponseType.None: return "warning";
    case ResponseType.Recep: return "info";
    case ResponseType.OK: return "success";
    case ResponseType.Pending: return "warning";
    case ResponseType.Ignore: return "danger";
    case ResponseType.Reject: return "danger";
  }
  return "danger";
}
export function getUserStatusSeverity(data?: UserStatus): any {
  switch (data) {
    case UserStatus.None: return "info";
    case UserStatus.Live: return "success";
    case UserStatus.Stop: return "warning";
    case UserStatus.Delete: return "warning";
    case UserStatus.Expired: return "danger";
  }

  return "danger";
}
export function getEDIStateSeverity(data?: EDIState): any {
  switch (data) {
    case EDIState.None: return "info";
    case EDIState.OK: return "success";
    case EDIState.Reject: return "danger";
    case EDIState.Pending: return "warning";
    case EDIState.Partial: return "info";
  }

  return "danger";
}
export function getQnAStateSeverity(data?: QnAState): any {
  switch (data) {
    case QnAState.None: return "warning";
    case QnAState.OK: return "success";
    case QnAState.Recep: return "warning";
    case QnAState.Reply: return "info";
  }

  return "warning";
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
      onError(e.message);
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

export function applyClass<T>(classObj: { new (): T }, fn: (obj: T) => void): T {
  const ret = new classObj();
  fn(ret);
  return ret;
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

export function findIndexInList<T = any>(value: T, list: T[]): number {
  return list.indexOf(value)
}
export function distinct<T>(array: T[], keySelector?: (item: T) => any): T[] {
  if (!keySelector) {
    return Array.from(new Set(array));
  }

  const seen = new Set<any>();
  return array.filter((item) => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
export function distinctByFields<T>(array: T[], fields: (keyof T | string)[]): T[] {
  const seen = new Set<string>();
  return array.filter((item) => {
    const key = fields.map((field) => typeof field === "string" ? getNestedValue(item, field) : item[field]).join("|");
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((o, key) => (o ? o[key] : undefined), obj);
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

function getBlobModel(blobName: string, thisPK: string, file: File, blobStorageInfo: BlobStorageInfoModel, ext: string): BlobUploadModel {
  const blobUrl = `${blobStorageInfo.blobUrl}/${blobStorageInfo.blobContainerName}/${blobName}`;
  return applyClass(BlobUploadModel, (obj) => {
    obj.blobUrl = blobUrl;
    obj.blobName = blobName;
    obj.uploaderPK = thisPK;
    obj.originalFilename = ableFilename(file.name);
    obj.mimeType = getMimeTypeExt(ext);
  });
}
export function getUserBlobModel(userId: string, file: File, blobStorageInfo: BlobStorageInfoModel, ext: string): BlobUploadModel {
  const blobName = `user/${userId}/${currentDateYYYYMMdd()}/${FAmhohwa.getRandomUUID()}.${ext}`;
  return getBlobModel(blobName, FAmhohwa.getThisPK(), file, blobStorageInfo, ext);
}
export function getPharmaBlobModel(file: File, blobStorageInfo: BlobStorageInfoModel, ext: string): BlobUploadModel {
  const blobName = `pharma/${currentDateYYYYMMdd()}/${FAmhohwa.getRandomUUID()}.${ext}`;
  return getBlobModel(blobName, FAmhohwa.getThisPK(), file, blobStorageInfo, ext);
}
export function getHospitalBlobModel(file: File, blobStorageInfo: BlobStorageInfoModel, ext: string): BlobUploadModel {
  const blobName = `hospital/${currentDateYYYYMMdd()}/${FAmhohwa.getRandomUUID()}.${ext}`;
  return getBlobModel(blobName, FAmhohwa.getThisPK(), file, blobStorageInfo, ext);
}
export function getQnAReplyPostFileModel(file: File, thisPK: string, blobStorageInfo: BlobStorageInfoModel, ext: string, mimeType: string): QnAReplyFileModel {
  const userName = FAmhohwa.getUserID();
  const blobName = `qna/${userName}/${currentDateYYYYMMdd()}/${FAmhohwa.getRandomUUID()}.${ext}`;
  const blobUrl = `${blobStorageInfo.blobUrl}/${blobStorageInfo.blobContainerName}/${blobName}`;
  return applyClass(QnAReplyFileModel, (obj) => {
    obj.replyPK = thisPK;
    obj.blobUrl = blobUrl;
    obj.blobName = blobName;
    obj.originalFilename = ableFilename(file.name);
    obj.mimeType = mimeType;
  });
}

export function userFileListToViewModel(userFileList: UserFileModel[]): FileViewModel[] {
  return userFileList.map(x => applyClass(FileViewModel, (obj) => {
    obj.mimeType = x.mimeType;
    obj.blobUrl = x.blobUrl;
    obj.filename = ableFilename(x.originalFilename);
    obj.ext = getExtMimeType(x.mimeType);
    obj.regDate = x.regDate;
  }));
}
export function ediFileListToViewModel(ediFileList: EDIUploadFileModel[]): FileViewModel[] {
  return ediFileList.map(x => applyClass(FileViewModel, (obj) => {
    obj.mimeType = x.mimeType;
    obj.blobUrl = x.blobUrl;
    obj.filename = ableFilename(x.originalFilename);
    obj.ext = getExtMimeType(x.mimeType);
    obj.regDate = x.regDate;
  }));
}
export function qnaFileListToViewModel(qnaFileList: QnAFileModel[]): FileViewModel[] {
  return qnaFileList.map(x => applyClass(FileViewModel, (obj) => {
    obj.mimeType = x.mimeType;
    obj.blobUrl = x.blobUrl;
    obj.filename = ableFilename(x.originalFilename);
    obj.ext = getExtMimeType(x.mimeType);
    obj.regDate = x.regDate;
  }));
}
export function qnaReplyFileListToViewModel(qnaReplyFileList: QnAReplyFileModel[]): FileViewModel[] {
  return qnaReplyFileList.map(x => applyClass(FileViewModel, (obj) => {
    obj.mimeType = x.mimeType;
    obj.blobUrl = x.blobUrl;
    obj.filename = ableFilename(x.originalFilename);
    obj.ext = getExtMimeType(x.mimeType);
    obj.regDate = x.regDate;
  }));
}

export async function gatheringAbleFile(fileList: FileList, notAble: (file: File) => void): Promise<UploadFileBuffModel[]> {
  const ret: UploadFileBuffModel[] = [];
  for (let buff of fileList) {
    const ext = await getFileExt(buff);
    if (!isAbleUpload(ext)) {
      notAble(buff);
      continue;
    }
    ret.push(applyClass(UploadFileBuffModel, (obj) => {
      obj.file = buff;
      obj.filename = ableFilename(buff.name);
      obj.mimeType = getMimeTypeExt(ext);
      obj.blobUrl = parseFileBlobUrl(buff, ext);
      obj.ext = ext;
    }));
  }
  return ret;
}

export function getFilenameExt(filename: string): string {
  const dotIndex = filename.lastIndexOf(".") + 1;
  if (dotIndex <= 0 || dotIndex >= filename.length) {
    return "";
  }
  return filename.substring(dotIndex).toLowerCase();
}
export function blobUrlThumbnail(blobUrl: string, mimeType: string): string {
  const ext = getExtMimeType(mimeType);

  if (isImage(ext)) {
    return blobUrl;
  } else if (ext == "zip") {
    return FConstants.ASSETS_ZIP_IMAGE;
  } else if (ext == "pdf") {
    return FConstants.ASSETS_PDF_IMAGE;
  } else if (ext == "xlsx" || ext == "xls") {
    return FConstants.ASSETS_XLSX_IMAGE;
  } else if (ext == "docx" || ext == "doc" ) {
    return FConstants.ASSETS_DOCX_IMAGE;
  }

  return FConstants.ASSETS_NO_IMAGE;
}
export function parseFileBlobUrl(file: File, ext?: string): string {
  if (ext == null) {
    return FConstants.ASSETS_NO_IMAGE;
  }
  if (isImage(ext)) {
    return URL.createObjectURL(file);
  } else if (ext == "zip") {
    return FConstants.ASSETS_ZIP_IMAGE;
  } else if (ext == "pdf") {
    return FConstants.ASSETS_PDF_IMAGE;
  } else if (ext == "xlsx" || ext == "xls") {
    return FConstants.ASSETS_XLSX_IMAGE;
  } else if (ext == "docx" || ext == "doc" ) {
    return FConstants.ASSETS_DOCX_IMAGE;
  }

  return FConstants.ASSETS_NO_IMAGE;
}
export function extToBlobUrl(ext: string): string {
  if (ext == "zip") {
    return FConstants.ASSETS_ZIP_IMAGE;
  } else if (ext == "pdf") {
    return FConstants.ASSETS_PDF_IMAGE;
  } else if (ext == "xlsx" || ext == "xls") {
    return FConstants.ASSETS_XLSX_IMAGE;
  } else if (ext == "docx" || ext == "doc" ) {
    return FConstants.ASSETS_DOCX_IMAGE;
  }

  return FConstants.ASSETS_NO_IMAGE;
}
export async function getFileExt(file: File, byteCount: number = 8): Promise<string> {
  const magicNumber = await getMagicNumber(file, byteCount);
  if (magicNumber.startsWith("50 4B 03 04")) return getFilenameExt(file.name);
  if (magicNumber.startsWith("50 4B 30 30 50 4B 03 04")) return "zip";
  if (magicNumber.startsWith("25 50 44 46")) return "pdf";
  if (magicNumber.startsWith("FF D8 FF")) return "jpeg";
  if (magicNumber.startsWith("89 50 4E 47")) return "png";
  if (magicNumber.startsWith("42 4D")) return "bmp";
  if (magicNumber.startsWith("52 49 46 46") && (await getMagicNumber(file, 12)).includes("57 45 42 50")) return "webp";
  if (magicNumber.startsWith("00 00 00 18 66 74 79 70")) return "heic";
  if (magicNumber.startsWith("66 74 79 70 68 65 69 63")) return "heic";
  if (magicNumber.startsWith("47 49 46")) return "gif";

  return "unknown";
}
export async function getMagicNumber(file: File, byteCount: number = 8): Promise<string> {
  let header = "";
  try {
    const arrayBuff = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuff.slice(0, byteCount))
    uint8Array.forEach(x => header += `${x.toString(16).padStart(2, "0")} `);
  } catch {
  }
  return header.toUpperCase();
}
export function isAbleUpload(ext: string): boolean {
  if (isImage(ext)) return true;
  if (ext == "zip") return true;
  if (ext == "pdf") return true;
  if (ext == "xlsx" || ext == "xls") return true;
  if (ext == "docx" || ext == "doc") return true;
  return false;
}
export function isImage(ext: string): boolean {
  if (ext == "jpeg") return true;
  if (ext == "jpg") return true;
  if (ext == "png") return true;
  if (ext == "bmp") return true;
  if (ext == "webp") return true;
  if (ext == "heic") return true;
  if (ext == "gif") return true;

  return false;
}
export async function blobAddText(blob: Blob, text: string, mimeType: string = "image/jpeg", addTextOptionModel: AddTextOptionModel = new AddTextOptionModel()): Promise<Blob> {
  const ext = getExtMimeType(mimeType);
  if (ext == "pdf") {
    return await pdfBlobAddText(blob, text, mimeType, addTextOptionModel);
  }
  if (!isImage(ext)) {
    return blob;
  }
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      if (context) {
        canvas.width = image.width;
        canvas.height = addTextOptionModel.calcCanvasY(image.height);
        context.fillStyle = addTextOptionModel.imageBackground;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, addTextOptionModel.calcImageY());
        context.font = addTextOptionModel.calcImageFont();
        context.fillStyle = addTextOptionModel.textColor;
        const textWidth = context.measureText(text).width;
        context.fillText(text, addTextOptionModel.calcImageTextX(image.width, textWidth), addTextOptionModel.calcImageTextY(image.height));
        canvas.toBlob((blob) => resolve(blob!), mimeType);
      } else {
        reject("이미지 초기화 실패");
      }
      URL.revokeObjectURL(image.src);
    };
    image.src = URL.createObjectURL(blob);
  });
}
export async function pdfBlobAddText(blob: Blob, text: string, mimeType: string = "application/pdf", addTextOptionModel: AddTextOptionModel = new AddTextOptionModel()): Promise<Blob> {
  if (getExtMimeType(mimeType) != "pdf") {
    return blob;
  }
  const arrayBuffer = await blob.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const fontBytes = await fetch("assets/fonts/NanumGothicLight.ttf").then(res => res.arrayBuffer());
  const customFont = await pdfDoc.embedFont(fontBytes);
  const textWidth = customFont.widthOfTextAtSize(text, addTextOptionModel.fontSize);
  for (let i = 0; i < pages.length; i++) {
    const pageBuff = pages[i];
    const { width, height } = pageBuff.getSize();
    pageBuff.drawText(`${text}_${i + 1}`, {
      x: addTextOptionModel.calcPdfTextX(width, textWidth),
      y: addTextOptionModel.calcPdfTextY(height),
      size: addTextOptionModel.calcPdfFontSize(),
      font: customFont,
      color: rgb(0,0,0)
    });
  }
  return new Blob([await pdfDoc.save()], { type: mimeType });
}
export function ableFilename(filename: string): string {
  const invalidChars = /[\\\/:*?"<>|]/g;
  return filename.replace(invalidChars, "");
}
export function getExtMimeType(mimeType?: string): string {
  switch (mimeType) {
    case FContentsType.type_aac: return "aac";
    case FContentsType.type_abw: return "abw";
    case FContentsType.type_arc: return "arc";
    case FContentsType.type_avi: return "avi";
    case FContentsType.type_azw: return "azw";
    case FContentsType.type_bin: return "bin";
    case FContentsType.type_bz: return "bz";
    case FContentsType.type_bz2: return "bz2";
    case FContentsType.type_csh: return "csh";
    case FContentsType.type_css: return "css";
    case FContentsType.type_csv: return "csv";
    case FContentsType.type_doc: return "doc";
    case FContentsType.type_epub: return "epub";
    case FContentsType.type_gif: return "gif";
    case FContentsType.type_htm: return "htm";
    case FContentsType.type_html: return "html";
    case FContentsType.type_heic: return "heic";
    case FContentsType.type_heif: return "heif";
    case FContentsType.type_ico: return "ico";
    case FContentsType.type_ics: return "ics";
    case FContentsType.type_jar: return "jar";
    case FContentsType.type_jpeg: return "jpeg";
    case FContentsType.type_jpg: return "jpg";
    case FContentsType.type_js: return "js";
    case FContentsType.type_json: return "json";
    case FContentsType.type_mid: return "mid";
    case FContentsType.type_midi: return "midi";
    case FContentsType.type_mpeg: return "mpeg";
    case FContentsType.type_mpkg: return "mpkg";
    case FContentsType.type_odp: return "odp";
    case FContentsType.type_ods: return "ods";
    case FContentsType.type_odt: return "odt";
    case FContentsType.type_oga: return "oga";
    case FContentsType.type_ogv: return "ogv";
    case FContentsType.type_ogx: return "ogx";
    case FContentsType.type_png: return "png";
    case FContentsType.type_pdf: return "pdf";
    case FContentsType.type_ppt: return "ppt";
    case FContentsType.type_rar: return "rar";
    case FContentsType.type_rtf: return "rtf";
    case FContentsType.type_sh: return "sh";
    case FContentsType.type_svg: return "svg";
    case FContentsType.type_swf: return "swf";
    case FContentsType.type_tar: return "tar";
    case FContentsType.type_tif: return "tif";
    case FContentsType.type_tiff: return "tiff";
    case FContentsType.type_ttf: return "ttf";
    case FContentsType.type_txt: return "txt";
    case FContentsType.type_vsd: return "vsd";
    case FContentsType.type_wav: return "wav";
    case FContentsType.type_weba: return "weba";
    case FContentsType.type_webm: return "webm";
    case FContentsType.type_webp: return "webp";
    case FContentsType.type_woff: return "woff";
    case FContentsType.type_xhtml: return "xhtml";
    case FContentsType.type_xls: return "xls";
    case FContentsType.type_xlsx: return "xlsx";
    case FContentsType.type_xlsm: return "xlsm";
    case FContentsType.type_xml: return "xml";
    case FContentsType.type_xul: return "xul";
    case FContentsType.type_zip: return "zip";
    case FContentsType.type_3gp: return "3gp";
    case FContentsType.type_3g2: return "3g2";
    case FContentsType.type_7z: return "7z";
    default: return "unknown";
  }
}
export function getMimeTypeExt(ext?: string): string {
  switch (ext) {
    case "aac": return FContentsType.type_aac;
    case "abw": return FContentsType.type_abw;
    case "arc": return FContentsType.type_arc;
    case "avi": return FContentsType.type_avi;
    case "azw": return FContentsType.type_azw;
    case "bin": return FContentsType.type_bin;
    case "bz": return FContentsType.type_bz;
    case "bz2": return FContentsType.type_bz2;
    case "csh": return FContentsType.type_csh;
    case "css": return FContentsType.type_css;
    case "csv": return FContentsType.type_csv;
    case "doc": return FContentsType.type_doc;
    case "epub": return FContentsType.type_epub;
    case "gif": return FContentsType.type_gif;
    case "htm": return FContentsType.type_htm;
    case "html": return FContentsType.type_html;
    case "heic": return FContentsType.type_heic;
    case "heif": return FContentsType.type_heif;
    case "ico": return FContentsType.type_ico;
    case "ics": return FContentsType.type_ics;
    case "jar": return FContentsType.type_jar;
    case "jpeg": return FContentsType.type_jpeg;
    case "jpg": return FContentsType.type_jpg;
    case "js": return FContentsType.type_js;
    case "json": return FContentsType.type_json;
    case "mid": return FContentsType.type_mid;
    case "midi": return FContentsType.type_midi;
    case "mpeg": return FContentsType.type_mpeg;
    case "mpkg": return FContentsType.type_mpkg;
    case "odp": return FContentsType.type_odp;
    case "ods": return FContentsType.type_ods;
    case "odt": return FContentsType.type_odt;
    case "oga": return FContentsType.type_oga;
    case "ogv": return FContentsType.type_ogv;
    case "ogx": return FContentsType.type_ogx;
    case "png": return FContentsType.type_png;
    case "pdf": return FContentsType.type_pdf;
    case "ppt": return FContentsType.type_ppt;
    case "rar": return FContentsType.type_rar;
    case "rtf": return FContentsType.type_rtf;
    case "sh": return FContentsType.type_sh;
    case "svg": return FContentsType.type_svg;
    case "swf": return FContentsType.type_swf;
    case "tar": return FContentsType.type_tar;
    case "tif": return FContentsType.type_tif;
    case "tiff": return FContentsType.type_tiff;
    case "ttf": return FContentsType.type_ttf;
    case "txt": return FContentsType.type_txt;
    case "vsd": return FContentsType.type_vsd;
    case "wav": return FContentsType.type_wav;
    case "weba": return FContentsType.type_weba;
    case "webm": return FContentsType.type_webm;
    case "webp": return FContentsType.type_webp;
    case "woff": return FContentsType.type_woff;
    case "xhtml": return FContentsType.type_xhtml;
    case "xls": return FContentsType.type_xls;
    case "xlsx": return FContentsType.type_xlsx;
    case "xlsm": return FContentsType.type_xlsm;
    case "xml": return FContentsType.type_xml;
    case "xul": return FContentsType.type_xul;
    case "zip": return FContentsType.type_zip;
    case "3gp": return FContentsType.type_3gp;
    case "3g2": return FContentsType.type_3g2;
    case "7z": return FContentsType.type_7z;
    default: return "";
  }
}

export function regexPasswordCheck(data: string | undefined): boolean {
  if (data == undefined) {
    return false;
  }
  return FConstants.REGEX_CHECK_PASSWORD_0.test(data);
}
