import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { EmailNotificationBase } from '../email-templates/emailNotificationBase';
import { EmailProvider } from '../ports/emailProvider';
@Injectable()
export class EmailProviderMailerSendImpl implements EmailProvider {

    constructor(private config: ConfigService) { }

    async sendEmail(emailNotificationDto:EmailNotificationBase): Promise<boolean> {
        const apiKey = this.config.get('MAILERSEND_API_TOKEN');
        const domain = this.config.get('MAILERSEND_DOMAIN');

        const mailerSend = new MailerSend({
            apiKey: apiKey,
        });

        const sentFrom = new Sender(domain, "CMS");

        const recipients = [
            new Recipient(emailNotificationDto.recipentEmail, emailNotificationDto.username)
        ];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject(emailNotificationDto.subject || "")
            .setTemplateId(emailNotificationDto.templateId)

        emailParams.personalization = [{
            email: emailNotificationDto.recipentEmail,
            data: emailNotificationDto.variables
        }]

        let result = await mailerSend.email.send(emailParams);
        return result.statusCode == 202;
    }
}
