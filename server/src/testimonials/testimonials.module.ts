import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestimonialsController } from './controllers/testimonials.controller';
import { Testimonial } from './entities/testimonial.entity';
import { TestimonialsService } from './services/testimonials.service';
import { MediaStorageModule } from 'src/media-storage/mediaStorage.module';
import { MulterModule } from '@nestjs/platform-express';
import { CategoriesModule } from 'src/categories/categories.module';
import { OrganizationModule } from 'src/organizations/organitations.module';
import { UserOrganizationModule } from 'src/user_organization/userOrganization.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CommonModule } from 'src/common/common.module';
import { TestimonialInvitation } from './entities/testimonialInvitation.entity';
import { CreateTestimonialsUseCase } from './useCases/createTestimonial.useCase';
import { InviteTestimonialUseCase } from './useCases/inviteTestimonial.useCase';
import { TestimonialInvitationService } from './services/testimonialInvitation.service';
import { FindOneTestimonialUseCase } from './useCases/findOneTestimonial.useCase';
import { ChangeStatusTestimonialUseCase } from './useCases/changeStatusTestimonial.useCase';
import { RemoveTestimonialUseCase } from './useCases/removeTestimonial.useCase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Testimonial,TestimonialInvitation]),
    MulterModule.register({
      dest: './upload',
    }),
    MediaStorageModule,
    CategoriesModule,
    OrganizationModule,
    UserOrganizationModule,
    NotificationsModule,
    CommonModule
  ],
  controllers: [TestimonialsController],
  providers: [TestimonialsService,
    TestimonialInvitationService,CreateTestimonialsUseCase, 
    InviteTestimonialUseCase,
    FindOneTestimonialUseCase,
    ChangeStatusTestimonialUseCase,
    RemoveTestimonialUseCase,
  ],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}
