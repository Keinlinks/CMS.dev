import { Injectable, Logger } from '@nestjs/common';
import { MediaStorageProvider } from '../ports/mediaStorageProvider';

@Injectable()
export class MediaStorageService {
  private readonly logger = new Logger(MediaStorageService.name);
  constructor(private readonly mediaStorageProvider: MediaStorageProvider) {}

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<string> {
    this.logger.log(`Uploading file: ${fileName}`);
    return this.mediaStorageProvider.upload_stream(file, fileName);
  }
}
