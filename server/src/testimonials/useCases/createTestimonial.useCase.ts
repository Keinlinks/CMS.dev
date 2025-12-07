import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from '../entities/testimonial.entity';
import { MediaStorageService } from 'src/media-storage/services/mediaStorage.service';
import { CreateTestimonialDto } from '../dto/create-testimonial.dto';
import { CategoriesService } from 'src/categories/services/categories.service';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { TestimonialsService } from '../services/testimonials.service';

@Injectable()
export class CreateTestimonialsUseCase {
    private readonly logger = new Logger(CreateTestimonialsUseCase.name);
    constructor(
        private testimonialsService: TestimonialsService,
        private readonly mediaStorageService: MediaStorageService,
        private readonly categoryService: CategoriesService,
        private readonly organizationService: OrganizationsService,
    ) { }

    async createTestimonialWithMedia(
        createTestimonialDto: CreateTestimonialDto,
        file: Express.Multer.File,
        filename: string,
    ): Promise<Testimonial> {
        const org = await this.organizationService.findOneUnsafe(createTestimonialDto.organization_id);
        if (!org) {
            throw new NotFoundException(`Organization ${createTestimonialDto.organization_id} does not exist`);
        }
        const category = await this.categoryService.findOne(createTestimonialDto.category_id);
        if (!category) {
            throw new NotFoundException(`Category ${createTestimonialDto.category_id} does not exist`);
        }
        const testimonial: Partial<Testimonial> = {
            ...createTestimonialDto,
            status: "pending",
        }
        try {
            let objectFilename = this.generateMediaFilename(
                createTestimonialDto.organization_id,
                filename,
            );
            let secureUrl = await this.mediaStorageService.uploadFile(
                file,
                objectFilename,
            );
            testimonial.media_url = secureUrl;
            this.logger.log(`Creating testimonial for organization ${createTestimonialDto.organization_id} with media`);
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
    async createTestimonial(createTestimonialDto: CreateTestimonialDto) {
        const org = await this.organizationService.findOneUnsafe(createTestimonialDto.organization_id);
        if (!org) {
            throw new NotFoundException(`Organization ${createTestimonialDto.organization_id} does not exist`);
        }
        const category = await this.categoryService.findOne(createTestimonialDto.category_id);
        if (!category) {
            throw new NotFoundException(`Category ${createTestimonialDto.category_id} does not exist`);
        }
        const testimonial: Partial<Testimonial> = {
            ...createTestimonialDto,
            status: "pending",
        }
        this.logger.log(`Creating testimonial for organization ${createTestimonialDto.organization_id} without media`);
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

}
