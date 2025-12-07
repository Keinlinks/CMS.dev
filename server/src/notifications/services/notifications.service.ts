import { Injectable } from '@nestjs/common';
import { EmailNotificationBase } from '../email-templates/emailNotificationBase';
import { EmailProvider } from '../ports/emailProvider';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly emailProvider: EmailProvider,
    ) {}

    async sendNotificationWithTemplate(emailNotificationDto:EmailNotificationBase){
        return await this.emailProvider.sendEmail(emailNotificationDto)
    }
}
