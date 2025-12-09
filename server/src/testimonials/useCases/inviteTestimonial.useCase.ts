import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { NotificationsService } from "src/notifications/services/notifications.service";
import { TestimonialInvitationEmailTemplate } from "src/notifications/email-templates/testimonialInvitation.template";
import { EncoderService } from "src/common/services/encoder.service";
import { UserOrganizationService } from "src/user_organization/services/userOrganization.service";
import { OrganizationRole } from "src/common/types/userRole";
import { TestimonialInvitationService } from "../services/testimonialInvitation.service";
import { InviteTestimonialDto } from "../dto/invite-testimonial.dto";
import { CategoriesService } from "src/categories/services/categories.service";

@Injectable()
export class InviteTestimonialUseCase {
    private readonly logger = new Logger(InviteTestimonialUseCase.name);
    constructor(
        private readonly testimonialsInvitationService: TestimonialInvitationService,
        private readonly notificationService: NotificationsService,
        private readonly encoderService: EncoderService,
        private readonly userOrganization:UserOrganizationService,
        private readonly categoriesService:CategoriesService
    ) { }

    async execute(input:InviteTestimonialDto,userId:string): Promise<{ message: string }> {
        if (input.emails.length < 1)
            throw new BadRequestException("Emails can't be empty")
        let userOrg = await this.userOrganization.findUserOrganization(userId,input.organizationId);
        if(!userOrg)
            throw new UnauthorizedException("Unauthorized to invite testimonials for this organization");
        let category = await this.categoriesService.findOne(input.categoryId);
        if(!category)
            throw new BadRequestException("Category does not exist");
        if(userOrg.role !== OrganizationRole.ADMINISTRATOR)
            throw new UnauthorizedException("Only administrators can invite testimonials for this organization");
        
        const tasks = input.emails.map(async (email) => {
            const token = await this.encoderService.generateToken();

            const invitation = await this.testimonialsInvitationService.create(email, token,category.id);

            let emailTemplate:TestimonialInvitationEmailTemplate = new TestimonialInvitationEmailTemplate({toEmail:invitation.email,token:invitation.token});
            return this.notificationService.sendNotificationWithTemplate(emailTemplate);
        });

        await Promise.all(tasks);
        this.logger.log(`Invitations sent to emails: ${input.emails.join(", ")}`);
        this.logger.debug(`Invitation input: ${JSON.stringify(input)}`)
        return { message: "Todas las invitaciones se enviaron correctamente" };
    }
}