import { Injectable } from "@nestjs/common";
import { MediaStorageProvider } from "../ports/mediaStorageProvider";

@Injectable()
export class MediaStorageProviderFakeImpl implements MediaStorageProvider {


  async upload_stream(file: Express.Multer.File, fileName: string): Promise<string> {
    return `https://fake-storage.local/${fileName}`;
  }
}