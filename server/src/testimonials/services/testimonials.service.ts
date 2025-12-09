import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UpdateTestimonialDto } from '../dto/update-testimonial.dto';
import { Testimonial } from 'src/testimonials/entities/testimonial.entity';
import { TestimonialsParamsDto } from '../dto/testimonials.params.dto';
import { UserOrganizationService } from 'src/user_organization/services/userOrganization.service';
import { WallTestimonialsParamsDto } from '../dto/wallTestimonials.params.dto';
import { TestimonialStatus } from '../enums/testimonialStatus';
import { OrganizationRole } from 'src/common/types/userRole';


@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private testimonialsRepository: Repository<Testimonial>,
    private readonly userOrganization: UserOrganizationService
  ) { }

  async create(createTestimonial: Partial<Testimonial>): Promise<Testimonial> {
    const testimonial = this.testimonialsRepository.create(createTestimonial);
    return this.testimonialsRepository.save(testimonial);
  }

  async findAll(filters: TestimonialsParamsDto, userId: string): Promise<Testimonial[]> {
    let org = await this.userOrganization.findUserOrganization(userId, filters.organizationId);
    if (!org) {
      throw new UnauthorizedException(`User is not part of the organization ${filters.organizationId}`);
    }
    const { page = 1, itemsPerPage = 20, sort = 'ASC' } = filters;
    const limit = itemsPerPage;
    const offset = (page - 1) * itemsPerPage;

    let createdAtFilter;

    if (filters.createdFrom && filters.createdTo) {
      createdAtFilter = Between(
        new Date(filters.createdFrom),
        new Date(filters.createdTo),
      );
    } else if (filters.createdFrom) {
      createdAtFilter = MoreThanOrEqual(new Date(filters.createdFrom));
    } else if (filters.createdTo) {
      createdAtFilter = LessThanOrEqual(new Date(filters.createdTo));
    }

    return this.testimonialsRepository.find({
      relations: ['category', 'tags'],
      skip: offset,
      take: limit,
      order: { createdAt: sort },
      where: {
        organitation_id: filters.organizationId,
        status: filters.status,
        stars_rating: filters.startsRating,
        ...(createdAtFilter && { createdAt: createdAtFilter }),
      },
    });
  }

  async findAllWallTestimonials(params: WallTestimonialsParamsDto): Promise<Testimonial[]> {
    const { page = 1, itemsPerPage = 20, sort = 'ASC' } = params;
    const limit = itemsPerPage;
    const offset = (page - 1) * itemsPerPage;

    return this.testimonialsRepository.find({
      skip: offset,
      take: limit,
      order: {
        createdAt: sort,
      },
      where: {
        organization_id: params.organitationId,
        status: 'published',
      }
    });
  }

  async findOne(id: string, userId: string): Promise<Testimonial> {

    const testimonial = await this.testimonialsRepository.findOne({
      where: { id },
      relations: ['category', 'tags'],
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    let org = await this.userOrganization.findUserOrganization(userId, testimonial.organization_id);
    if (!org) {
      throw new UnauthorizedException(`User is not part of the organization ${testimonial.organization_id}`);
    }
    return testimonial;
  }

  async findByOrganitation(organitationId: string, param: TestimonialsParamsDto): Promise<Testimonial[]> {
    const { status } = param
    return this.testimonialsRepository.find({
      where: status ? { status, organization_id: organitationId } : { organization_id: organitationId },
      relations: ['category', 'tags'],
    });
  }

  async findByCategory(categoryId: string): Promise<Testimonial[]> {
    return this.testimonialsRepository.find({
      where: { category_id: categoryId },
      relations: ['category', 'tags'],
    });
  }

  async changeStatus(testimonialId: string, userId: string, status: TestimonialStatus): Promise<Testimonial> {
    const testimonial = await this.testimonialsRepository.findOne({
      where: { id: testimonialId }
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${testimonialId} not found`);
    }
    let userOrg = await this.userOrganization.findUserOrganization(userId, testimonial.organization_id);
    if (!userOrg) {
      throw new UnauthorizedException(`User is not part of the organization ${testimonial.organization_id}`);
    }
    //if the status is the same, return the testimonial
    if (testimonial.status === status) {
      return testimonial;
    }
    //only administrators can publish testimonials
    if (status == TestimonialStatus.PUBLISHED && userOrg.role !== OrganizationRole.ADMINISTRATOR)
      throw new UnauthorizedException(`Only administrators can publish testimonials for the organization ${testimonial.organization_id}`);

    testimonial.status = status;
    return this.testimonialsRepository.save(testimonial);
  }

  async update(
    testimonialId: string,
    userId: string,
    updateTestimonialDto: UpdateTestimonialDto,
  ): Promise<Testimonial> {

    const testimonial = await this.testimonialsRepository.findOne({
      where: { id: testimonialId }
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${testimonialId} not found`);
    }
    let org = await this.userOrganization.findUserOrganization(userId, testimonial.organization_id);
    if (!org) {
      throw new UnauthorizedException(`User is not part of the organization ${testimonial.organization_id}`);
    }
    Object.assign(testimonial, updateTestimonialDto);
    return this.testimonialsRepository.save(testimonial);
  }

  async remove(testimonialId: string, userId: string): Promise<void> {
    const testimonial = await this.testimonialsRepository.findOne({
      where: { id: testimonialId }
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${testimonialId} not found`);
    }
    let org = await this.userOrganization.findUserOrganization(userId, testimonial.organization_id);
    if (!org) {
      throw new UnauthorizedException(`User is not part of the organization ${testimonial.organization_id}`);
    }
    await this.testimonialsRepository.remove(testimonial);
  }
}
