import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { EmailProvider } from './ports/emailProvider';
import { EmailProviderMailerSendImpl } from './adapters/emailProviderMailerSendImpl';

@Module({
  providers: [NotificationsService, {provide: EmailProvider, useClass: EmailProviderMailerSendImpl}],
  exports: [NotificationsService],
})
export class NotificationsModule {}
