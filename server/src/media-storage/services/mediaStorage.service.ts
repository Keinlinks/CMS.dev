import { Injectable } from '@nestjs/common';
import { MediaStorageProvider } from '../ports/mediaStorageProvider';

@Injectable()
export class MediaStorageService {
  constructor(private readonly mediaStorageProvider: MediaStorageProvider) {}

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<string> {
    return this.mediaStorageProvider.upload_stream(file, fileName);
  }
}
