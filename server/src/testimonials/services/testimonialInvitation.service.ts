import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TestimonialInvitation } from "../entities/testimonialInvitation.entity";
import { Repository } from "typeorm";



@Injectable()
export class TestimonialInvitationService {
    constructor(@InjectRepository(TestimonialInvitation) private readonly testimonialInvitationRepo: Repository<TestimonialInvitation>) { }

    async create(email: string, token: string, categoryId: string,organizationId:string) {
        const invitation = this.testimonialInvitationRepo.create({
            email,
            token,
            categoryId,
            organizationId,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            used_at: null,
        });

        return this.testimonialInvitationRepo.save(invitation);
    }

    async findByToken(token: string): Promise<TestimonialInvitation | null> {
        return this.testimonialInvitationRepo.findOne({ where: { token } });
    }

    async update(updatedTestimonialInvitation: TestimonialInvitation): Promise<TestimonialInvitation> {
        return this.testimonialInvitationRepo.save(updatedTestimonialInvitation);
    }
}