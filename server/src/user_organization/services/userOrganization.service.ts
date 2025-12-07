import { InjectRepository } from "@nestjs/typeorm";
import { UserOrganization } from "../entities/userOrganization.entity";
import { Repository } from "typeorm";


export class UserOrganizationService{
    constructor(@InjectRepository(UserOrganization)
        private userOrganizationRepository: Repository<UserOrganization>){}
    async findUserOrganization(userId: string, organizationId: string): Promise<UserOrganization | null> {
        return this.userOrganizationRepository.findOne({
            where: {
                userId,
                organizationId
            },
            select: ['userId', 'organizationId', 'role']
        });
    }
    async create(userOrganization: Partial<UserOrganization>): Promise<UserOrganization> {
        const toSave = this.userOrganizationRepository.create(userOrganization);
        return this.userOrganizationRepository.save(toSave);
    }

    async delete(userId: string, organizationId: string): Promise<boolean> {
        await this.userOrganizationRepository.delete({
            userId,
            organizationId
        });
        return true;
    }
}