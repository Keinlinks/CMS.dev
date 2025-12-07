import { EmailNotificationBase } from "../email-templates/emailNotificationBase";

export abstract class EmailProvider {
  abstract sendEmail(emailNotificationDto:EmailNotificationBase): Promise<boolean>;
}