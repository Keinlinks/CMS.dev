import { Injectable, Logger } from "@nestjs/common";
import { OrganizationsService } from "../services/organizations.service";
import { CreateOrganizationDto } from "../dto/create-organization.dto";
import { MediaStorageService } from "src/media-storage/services/mediaStorage.service";
import { UserOrganizationService } from "src/user_organization/services/userOrganization.service";
import { OrganizationRole } from "src/common/types/userRole";


@Injectable()
export class CreateOrganizationUseCase {
    private readonly logger = new Logger(CreateOrganizationUseCase.name);
    constructor(
        private readonly organizationService: OrganizationsService,
        private readonly mediaStorageService: MediaStorageService,
        private readonly userOrganizationService: UserOrganizationService
    ) { }

    async execute(input: CreateOrganizationDto,userId:string, file?:Express.Multer.File) {
        this.logger.log("Attempt to create an organization");
        this.logger.debug(`Attempt to create an organization details: ${JSON.stringify(input)}`)
        let logoUrl: string | undefined;
        if (file) {
            const mediaUrl = await this.mediaStorageService.uploadFile(file, file.filename);
            logoUrl = mediaUrl;
        }
        const org = await this.organizationService.create(input.name,input.description,input.questionText,logoUrl);

        await this.userOrganizationService.create({
            userId: userId,
            organizationId: org.id,
            role: OrganizationRole.ADMINISTRATOR,
        });
        this.logger.log(`Organization created, id: ${org.id}`)
        this.logger.debug(`Organization created details: ${JSON.stringify(org)}`)
        return org;
    }
}