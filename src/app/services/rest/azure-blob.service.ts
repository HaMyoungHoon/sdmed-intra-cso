import { Injectable } from "@angular/core";
import {BlobServiceClient, BlockBlobUploadResponse} from "@azure/storage-blob";
import * as FConstants from "../../guards/f-constants";

@Injectable({
  providedIn: "root"
})
export class AzureBlobService {
  putUpload(file: File, blobName: string, sasKey: string, mimeType: string, onProgress?: (log: any) => void): Promise<BlockBlobUploadResponse> {
    const blobServiceClient = new BlobServiceClient(`${FConstants.BLOB_URL}?${sasKey}`);
    const containerClient = blobServiceClient.getContainerClient(FConstants.BLOB_CONTAINER_NAME);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    blobClient.setHTTPHeaders({
      blobContentType: mimeType
    }).then();
    return blobClient.upload(file, file.size, {
      onProgress: (log) => onProgress?.(log)
    });
  }
}
