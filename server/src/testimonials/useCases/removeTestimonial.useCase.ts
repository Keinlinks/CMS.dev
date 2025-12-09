import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { TestimonialsService } from "../services/testimonials.service";
import { UserOrganizationService } from "src/user_organization/services/userOrganization.service";
import { OrganizationRole } from "src/common/types/userRole";

@Injectable()
export class RemoveTestimonialUseCase {
    constructor(private readonly testimonialService: TestimonialsService, private readonly userOrganizationService: UserOrganizationService) { }

    async execute(testimonialId: string, userId: string) {
        const testimonial = await this.testimonialService.findOne(testimonialId);
        if (!testimonial)
            throw new NotFoundException("Testimonial not founded");

        const userOrg = await this.userOrganizationService.findUserOrganization(userId, testimonial.organization_id);
        if (!userOrg) {
            throw new UnauthorizedException(`User is not part of the organization ${testimonial.organization_id}`);
        }

        if(userOrg.role !== OrganizationRole.ADMINISTRATOR)
            throw new UnauthorizedException(`Only administrators can remove testimonials for the organization ${testimonial.organization_id}`);

        return await this.testimonialService.removeById(testimonialId);
    }
}