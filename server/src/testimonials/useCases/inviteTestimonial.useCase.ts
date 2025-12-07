import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TestimonialInvitation } from "../entities/testimonialInvitation.entity";
import { Repository } from "typeorm";
import { NotificationsService } from "src/notifications/services/notifications.service";
import { TestimonialInvitationEmailTemplate } from "src/notifications/email-templates/testimonialInvitation.template";
import { EncoderService } from "src/common/services/encoder.service";
import { UserOrganizationService } from "src/user_organization/services/userOrganization.service";
import { OrganizationRole } from "src/common/types/userRole";
import { TestimonialInvitationService } from "../services/testimonialInvitation.service";


@Injectable()
export class InviteTestimonialUseCase {
    private readonly logger = new Logger(InviteTestimonialUseCase.name);
    constructor(
        private readonly testimonialsInvitationService: TestimonialInvitationService,
        private readonly notificationService: NotificationsService,
        private readonly encoderService: EncoderService,
        private readonly userOrganization:UserOrganizationService
    ) { }

    async execute(emails: string[],organizationId:string,userId:string): Promise<{ message: string }> {
        if (emails.length < 1)
            throw new BadRequestException("Emails can't be empty")
        let userOrg = await this.userOrganization.findUserOrganization(userId,organizationId);
        if(!userOrg)
            throw new UnauthorizedException("Unauthorized to invite testimonials for this organization");
        if(userOrg.role !== OrganizationRole.ADMINISTRATOR)
            throw new UnauthorizedException("Only administrators can invite testimonials for this organization");
        
        const tasks = emails.map(async (email) => {
            const token = await this.encoderService.generateToken();

            const invitation = await this.testimonialsInvitationService.create(email, token);

            let emailTemplate:TestimonialInvitationEmailTemplate = new TestimonialInvitationEmailTemplate({toEmail:invitation.email,token:invitation.token});
            return this.notificationService.sendNotificationWithTemplate(emailTemplate);
        });

        await Promise.all(tasks);
        this.logger.log(`Invitations sent to emails: ${emails.join(", ")}`);
        return { message: "Todas las invitaciones se enviaron correctamente" };
    }
}