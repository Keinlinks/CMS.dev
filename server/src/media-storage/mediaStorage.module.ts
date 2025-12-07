import { Module } from '@nestjs/common';
import { MediaStorageService } from './services/mediaStorage.service';
import { MediaStorageProvider } from './ports/mediaStorageProvider';
import { MediaStorageProviderCloudinaryImpl } from './adapters/mediaStorageProviderCloudinaryImpl';

@Module({
  imports: [],
  controllers: [],
  providers: [{ provide: MediaStorageProvider, useClass:MediaStorageProviderCloudinaryImpl },MediaStorageService],
  exports: [MediaStorageService],
})
export class MediaStorageModule {}
