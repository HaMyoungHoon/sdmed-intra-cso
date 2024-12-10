import { Injectable } from "@angular/core";
import {BlobServiceClient, BlockBlobUploadResponse} from "@azure/storage-blob";

@Injectable({
  providedIn: "root"
})
export class AzureBlobService {
  private blobUrl = "https://mhhablob1.blob.core.windows.net";
  private containerName = "mhhablob1";

  putUpload(file: File, blobName: string, sasKey: string, mimeType: string, onProgress?: (log: any) => void): Promise<BlockBlobUploadResponse> {
    const blobServiceClient = new BlobServiceClient(`${this.blobUrl}?${sasKey}`);
    const containerClient = blobServiceClient.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    blobClient.setHTTPHeaders({
      blobContentType: mimeType
    }).then();
    return blobClient.upload(file, file.size, {
      onProgress: (log) => onProgress?.(log)
    });
  }
}
