import { API_BASE_URL } from "src/common/constant/constant";
import { EmailNotificationBase } from "./emailNotificationBase";
import { InvitationTestimonialTemplateDto } from "../dto/invitationTestimonial.dto";
import { INVITATION_TESTIMONIAL_TEMPLATE_ID } from "../constants/templatesId";

export class TestimonialInvitationEmailTemplate extends EmailNotificationBase{

    constructor(input:InvitationTestimonialTemplateDto){
        super();
        this.recipentEmail = input.toEmail;
        this.subject = `You're Invited to Share Your Testimonial!`;
        this.templateId = INVITATION_TESTIMONIAL_TEMPLATE_ID;
        this.variables = {
            token: input.token,
            username: input.username,
            domain: API_BASE_URL + "/testimonials/submit",
            logoUrl: input.logoUrl,
            organizationName: input.organizationName
        };
    }
}