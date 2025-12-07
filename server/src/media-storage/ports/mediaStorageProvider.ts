export abstract class MediaStorageProvider {
  abstract upload_stream(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<string>;
}