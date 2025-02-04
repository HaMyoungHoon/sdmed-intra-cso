export class UploadFileBuffModel {
  file?: File;
  filename: string = "";
  mimeType: string = "";
  blobUrl: string = "";
  ext: string = "";

  revokeBlob(): void {
    URL.revokeObjectURL(this.blobUrl);
    this.blobUrl = "";
  }
}
