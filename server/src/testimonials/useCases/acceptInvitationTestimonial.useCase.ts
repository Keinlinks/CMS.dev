import { BadRequestException, ConflictException, GoneException, Injectable } from "@nestjs/common";
import { TestimonialInvitationService } from "../services/testimonialInvitation.service";


@Injectable()
export class AcceptInvitationTestimonialUseCase{
    constructor(private readonly testimonialInvitationService:TestimonialInvitationService){}
    
    async execute(token:string){
        let invitation = await this.testimonialInvitationService.findByToken(token);
        if(!invitation)
            throw new BadRequestException("Invalid token");
        if(invitation.used_at)
            throw new ConflictException("Token already used");
        if(invitation.expires_at < new Date())
            throw new GoneException("Token expired");

        //At this point the token is valid and the controller must redirect to testimonial form in the frontend
    }
}