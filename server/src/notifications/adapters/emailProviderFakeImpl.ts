import { Injectable } from "@nestjs/common";
import { EmailProvider } from "../ports/emailProvider";
import { EmailNotificationBase } from "../email-templates/emailNotificationBase";

@Injectable()
export class EmailProviderFakeImpl implements EmailProvider {

    constructor() { }

    async sendEmail(emailNotificationDto:EmailNotificationBase): Promise<boolean> {
        console.log("Fake email sent to:", emailNotificationDto.recipentEmail);
        return true;
    }
}
