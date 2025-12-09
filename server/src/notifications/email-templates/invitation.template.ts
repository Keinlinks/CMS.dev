import { API_BASE_URL } from "src/common/constant/constant";
import { INVITATION_ORGANIZATION_TEMPLATE_ID } from "../constants/templatesId";
import { InvitationTemplateDto } from "../dto/invitationTemplate.dto";
import { EmailNotificationBase } from "./emailNotificationBase";


export class InvitationEmailTemplate extends EmailNotificationBase{

    constructor(input:InvitationTemplateDto){
        super();
        this.recipentEmail = input.toEmail;
        this.templateId = INVITATION_ORGANIZATION_TEMPLATE_ID;

        this.subject = `You're invited to join ${input.organizationName}!`;
        this.variables = {
            username: input.username,
            organizationName: input.organizationName,
            token: input.token,
            domain: API_BASE_URL + "/organization-management/invite"
        };
    }
}