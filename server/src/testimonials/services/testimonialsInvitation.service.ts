import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TestimonialInvitation } from "../entities/testimonialInvitation.entity";
import { Repository } from "typeorm";
import { NotificationsService } from "src/notifications/services/notifications.service";
import { TestimonialInvitationEmailTemplate } from "src/notifications/email-templates/testimonialInvitation.template";
import { EncoderService } from "src/common/services/encoder.service";
import { UserOrganizationService } from "src/user_organization/services/userOrganization.service";
import { OrganizationRole } from "src/common/types/userRole";


@Injectable()
export class TestimonialsInvitationService {
    private readonly logger = new Logger(TestimonialsInvitationService.name);
    constructor(
        @InjectRepository(TestimonialInvitation) private readonly testimonialsInvitationRepo: Repository<TestimonialInvitation>,
        private readonly notificationService: NotificationsService,
        private readonly encoderService: EncoderService,
        private readonly userOrganization:UserOrganizationService
    ) { }

    async inviteTestimonial(emails: string[],organizationId:string,userId:string): Promise<{ message: string }> {
        let userOrg = await this.userOrganization.findUserOrganization(userId,organizationId);
        if(!userOrg)
            throw new UnauthorizedException("Unauthorized to invite testimonials for this organization");
        if(userOrg.role !== OrganizationRole.ADMINISTRATOR)
            throw new UnauthorizedException("Only administrators can invite testimonials for this organization");
        
        const tasks = emails.map(async (email) => {
            const token = await this.encoderService.generateToken();

            const invitation = this.testimonialsInvitationRepo.create({
                email,
                token,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                used_at: null,
            });

            await this.testimonialsInvitationRepo.save(invitation);
            let emailTemplate:TestimonialInvitationEmailTemplate = new TestimonialInvitationEmailTemplate({toEmail:email,token:token});
            return this.notificationService.sendNotificationWithTemplate(emailTemplate);
        });

        await Promise.all(tasks);
        this.logger.log(`Invitations sent to emails: ${emails.join(", ")}`);
        return { message: "Todas las invitaciones se enviaron correctamente" };
    }
}