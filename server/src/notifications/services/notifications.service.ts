import { Injectable, Logger } from '@nestjs/common';
import { EmailNotificationBase } from '../email-templates/emailNotificationBase';
import { EmailProvider } from '../ports/emailProvider';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    constructor(
        private readonly emailProvider: EmailProvider,
    ) {}

    async sendNotificationWithTemplate(emailNotificationDto:EmailNotificationBase){
        this.logger.log(`Sending email to ${emailNotificationDto.recipentEmail} with subject: ${emailNotificationDto.subject}`);
        try{
            return await this.emailProvider.sendEmail(emailNotificationDto)
        }
        catch(ex){
            this.logger.error(`Error sending invitation to ${emailNotificationDto.recipentEmail}`, ex?.stack || ex);

            return false;
        }
    }
}
