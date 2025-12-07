import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from '../entities/testimonial.entity';
import { MediaStorageService } from 'src/media-storage/services/mediaStorage.service';
import { CreateTestimonialDto } from '../dto/create-testimonial.dto';
import { CategoriesService } from 'src/categories/services/categories.service';
import { OrganizationsService } from 'src/organizations/services/organizations.service';

@Injectable()
export class CreateTestimonialsService {
  private readonly logger = new Logger(CreateTestimonialsService.name);
  constructor(
    @InjectRepository(Testimonial)
    private testimonialsRepository: Repository<Testimonial>,
    private readonly mediaStorageService: MediaStorageService,
    private readonly categoryService: CategoriesService,
    private readonly organizationService: OrganizationsService,
  ) { }

  async createTestimonialWithMedia(
    createTestimonialDto: CreateTestimonialDto,
    file: Express.Multer.File,
    filename: string,
  ): Promise<Testimonial> {
    const org = await this.organizationService.findOneUnsafe(createTestimonialDto.organitation_id);
    if (!org) {
      throw new NotFoundException(`Organization ${createTestimonialDto.organitation_id} does not exist`);
    }
    const category = await this.categoryService.findOne(createTestimonialDto.category_id);
    if (!category) {
      throw new NotFoundException(`Category ${createTestimonialDto.category_id} does not exist`);
    }
    const testimonial =
      this.testimonialsRepository.create(createTestimonialDto);
    testimonial.status = "pending"
    try {
      let objectFilename = this.generateMediaFilename(
        createTestimonialDto.organitation_id,
        filename,
      );
      let publicId = await this.mediaStorageService.uploadFile(
        file,
        objectFilename,
      );
      testimonial.media_url = publicId;
      this.logger.log(`Creating testimonial for organization ${createTestimonialDto.organitation_id} with media`);
      this.logger.debug(`Testimonial details: ${JSON.stringify(testimonial)}`);
      return this.testimonialsRepository.save(testimonial);
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
    const org = await this.organizationService.findOneUnsafe(createTestimonialDto.organitation_id);
    if (!org) {
      throw new NotFoundException(`Organization ${createTestimonialDto.organitation_id} does not exist`);
    }
    const category = await this.categoryService.findOne(createTestimonialDto.category_id);
    if (!category) {
      throw new NotFoundException(`Category ${createTestimonialDto.category_id} does not exist`);
    }
    const testimonial =
      this.testimonialsRepository.create(createTestimonialDto);
    testimonial.status = "pending"
    this.logger.log(`Creating testimonial for organization ${createTestimonialDto.organitation_id} without media`);
    this.logger.debug(`Testimonial details: ${JSON.stringify(testimonial)}`);
    return this.testimonialsRepository.save(testimonial);
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
