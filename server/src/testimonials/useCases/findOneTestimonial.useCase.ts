import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { TestimonialsService } from "../services/testimonials.service";
import { UserOrganizationService } from "src/user_organization/services/userOrganization.service";

@Injectable()
export class FindOneTestimonialUseCase {
    constructor(private readonly testimonialsService:TestimonialsService,private readonly userOrganizationService:UserOrganizationService) { }

    async execute(testimonialId: string, userId: string) {
        const testimonial = await this.testimonialsService.findOne(testimonialId);
        if (!testimonial) {
            throw new NotFoundException(`Testimonial with ID ${testimonialId} not found`);
        }
        const userOrg = await this.userOrganizationService.findUserOrganization(userId, testimonial.organization_id);
        if (!userOrg) {
            throw new UnauthorizedException(`User is not part of the organization ${testimonial.organization_id}`);
        }
        return testimonial;
    }
}