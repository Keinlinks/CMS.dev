import { BadRequestException, ConflictException, GoneException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Testimonial } from '../entities/testimonial.entity';
import { MediaStorageService } from 'src/media-storage/services/mediaStorage.service';
import { CreateTestimonialDto } from '../dto/create-testimonial.dto';
import { CategoriesService } from 'src/categories/services/categories.service';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { TestimonialsService } from '../services/testimonials.service';
import { TestimonialInvitationService } from '../services/testimonialInvitation.service';
import { MediaType } from '../enums/mediaType';
import { TestimonialStatus } from '../enums/testimonialStatus';
import { TestimonialInvitation } from '../entities/testimonialInvitation.entity';

@Injectable()
export class CreateTestimonialsUseCase {
    private readonly logger = new Logger(CreateTestimonialsUseCase.name);
    constructor(
        private testimonialsService: TestimonialsService,
        private readonly mediaStorageService: MediaStorageService,
        private readonly categoryService: CategoriesService,
        private readonly organizationService: OrganizationsService,
        private readonly testimonialInvitationService: TestimonialInvitationService
    ) { }

    async execute(createTestimonialDto: CreateTestimonialDto, token: string, file?: Express.Multer.File) {
        let invitation = await this.testimonialInvitationService.findByToken(token);
        if (!invitation) throw new BadRequestException("Invalid token");
        this.validateInvitation(invitation);

        const org = await this.organizationService.findOneUnsafe(invitation.organizationId);
        if (!org) {
            throw new NotFoundException(`Organization ${invitation.organizationId} does not exist`);
        }

        const category = await this.categoryService.findOne(invitation.categoryId);
        if (!category) {
            throw new NotFoundException(`Category ${invitation.categoryId} does not exist`);
        }

        if (createTestimonialDto.media_type == MediaType.TEXT) {
            const testimonial = await this.createTestimonial(createTestimonialDto,category.id,invitation.organizationId);
            invitation.markAsUsed();
            await this.testimonialInvitationService.update(invitation);
            return testimonial;
        }

        if (!file)
            throw new UnprocessableEntityException('Media file is required for the selected media type');

        const testimonial = await this.createTestimonialWithMedia(createTestimonialDto,category.id,invitation.organizationId, file, file.originalname);
        invitation.markAsUsed();
        await this.testimonialInvitationService.update(invitation);
        return testimonial;
    }

    async createTestimonialWithMedia(
        createTestimonialDto: CreateTestimonialDto,
        categoryId:string,
        organizationId:string,
        file: Express.Multer.File,
        filename: string,
    ): Promise<Testimonial> {
        const mime = file.mimetype;
        if (!mime.startsWith('image') && !mime.startsWith('video'))
            throw new UnprocessableEntityException('Only image and video files are allowed');

        const type = createTestimonialDto.media_type;
        if (!mime.startsWith(type))
            throw new UnprocessableEntityException('Media type does not match the uploaded file');

        const testimonial: Partial<Testimonial> = {
            ...createTestimonialDto,
            category_id: categoryId,
            status: TestimonialStatus.PENDING,
        }
        try {
            let objectFilename = this.generateMediaFilename(
                organizationId,
                filename,
            );
            let secureUrl = await this.mediaStorageService.uploadFile(
                file,
                objectFilename,
            );
            testimonial.media_url = secureUrl;
            this.logger.log(`Creating testimonial for organization ${organizationId} with media`);
            this.logger.debug(`Testimonial details: ${JSON.stringify(testimonial)}`);
            return this.testimonialsService.create(testimonial);
        } catch (error) {
            this.logger.error(
                `Failed to upload media for testimonial: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException(
                `Failed to upload media: ${error.message}`,
            );
        }
    }
    async createTestimonial(createTestimonialDto: CreateTestimonialDto,categoryId:string,organizationId:string) {
        const testimonial: Partial<Testimonial> = {
            ...createTestimonialDto,
            category_id: categoryId,
            organization_id: organizationId,
            status: TestimonialStatus.PENDING,
        }
        this.logger.log(`Creating testimonial for organization ${organizationId} without media`);
        this.logger.debug(`Testimonial details: ${JSON.stringify(testimonial)}`);
        return this.testimonialsService.create(testimonial);
    }

    private generateMediaFilename(
        organizationId: string,
        originalFilename: string,
    ): string {
        const timestamp = Date.now();
        const sanitizedFilename = originalFilename.replace(/\s+/g, '_');
        return `testimonials/${organizationId}/${timestamp}_${sanitizedFilename}`;
    }
    private validateInvitation(invitation: TestimonialInvitation) {
        if (invitation.used_at) throw new ConflictException("Token already used");
        if (invitation.expires_at < new Date()) throw new GoneException("Token expired");
    }
}
