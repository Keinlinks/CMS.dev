import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { TestimonialStatus } from "../enums/testimonialStatus";
import { TestimonialsService } from "../services/testimonials.service";
import { UserOrganizationService } from "src/user_organization/services/userOrganization.service";
import { OrganizationRole } from "src/common/types/userRole";

@Injectable()
export class ChangeStatusTestimonialUseCase {
    constructor(private readonly testimonialsService:TestimonialsService,private readonly userOrganizationService:UserOrganizationService) { }

    async execute(testimonialId: string, userId: string, status: TestimonialStatus) {
        const testimonial = await this.testimonialsService.findOne(testimonialId);
        if (!testimonial) {
            throw new NotFoundException(`Testimonial with ID ${testimonialId} not found`);
        }
        let userOrg = await this.userOrganizationService.findUserOrganization(userId, testimonial.organization_id);
        if (!userOrg) {
            throw new UnauthorizedException(`User is not part of the organization ${testimonial.organization_id}`);
        }
        //if the status is the same, return the testimonial
        if (testimonial.status === status) {
            return testimonial;
        }
        //only administrators can publish testimonials
        if (status == TestimonialStatus.PUBLISHED && userOrg.role !== OrganizationRole.ADMINISTRATOR)
            throw new UnauthorizedException(`Only administrators can publish testimonials for the organization ${testimonial.organization_id}`);

        testimonial.status = status;
        return await this.testimonialsService.update(testimonial.id,testimonial)
    }
}