import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TestimonialInvitation } from "../entities/testimonialInvitation.entity";
import { Repository } from "typeorm";



@Injectable()
export class TestimonialInvitationService {
    constructor(@InjectRepository(TestimonialInvitation) private readonly testimonialInvitationRepo:Repository<TestimonialInvitation>) {}

    async create(email:string, token:string){
        const invitation = this.testimonialInvitationRepo.create({
            email,
            token,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            used_at: null,
        });

        return this.testimonialInvitationRepo.save(invitation);
    }
}