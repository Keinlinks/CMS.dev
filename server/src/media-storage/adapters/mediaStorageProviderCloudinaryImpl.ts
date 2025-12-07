import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'fs/promises';
import { MediaStorageProvider } from '../ports/mediaStorageProvider';

@Injectable()
export class MediaStorageProviderCloudinaryImpl implements MediaStorageProvider {

  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET')
    });
  }

  async upload_stream(file: Express.Multer.File, fileName: string): Promise<string> {
    try {
      const apiResponse = await cloudinary.uploader.upload(file.path, {
        filename_override: fileName,
        resource_type: 'auto',
        access_mode: 'public',
      });

      return apiResponse.secure_url;
    } finally {
      await unlink(file.path).catch(() => { });
    }
  }
}