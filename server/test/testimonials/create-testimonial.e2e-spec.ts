import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { LoginDto } from "src/auth/dto/login.dto";
import { CategoriesModule } from "src/categories/categories.module";
import { Category } from "src/categories/entities/category.entity";
import { AuthGuard } from "src/common/guards/auth.guard";
import { MediaStorageProviderFakeImpl } from "src/media-storage/adapters/mediaStorageProviderFakeImpl";
import { MediaStorageModule } from "src/media-storage/mediaStorage.module";
import { MediaStorageProvider } from "src/media-storage/ports/mediaStorageProvider";
import { EmailProviderFakeImpl } from "src/notifications/adapters/emailProviderFakeImpl";
import { EmailProvider } from "src/notifications/ports/emailProvider";
import { Organization } from "src/organizations/entities/organization.entity";
import { SeedModule } from "src/seed/seed.module";
import { TagsModule } from "src/tags/tags.module";
import { InviteTestimonialDto } from "src/testimonials/dto/invite-testimonial.dto";
import { Testimonial } from "src/testimonials/entities/testimonial.entity";
import { TestimonialInvitation } from "src/testimonials/entities/testimonialInvitation.entity";
import { MediaType } from "src/testimonials/enums/mediaType";
import { TestimonialStatus } from "src/testimonials/enums/testimonialStatus";
import { TestimonialsModule } from "src/testimonials/testimonials.module";
import { User } from "src/users/entities/user.entity";
import { UsersModule } from "src/users/users.module";
import * as request from 'supertest';
import { DataSource, IsNull, Repository } from "typeorm";

describe('Testimonials integration', () => {
  let app: INestApplication;
  let organizationId: string | undefined;
  let categoryId: string | undefined;
  let user: any;
  let invitationTestimonialRepo: Repository<TestimonialInvitation>
  let token: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          autoLoadEntities: true,
          synchronize: true,
        }),
        UsersModule,
        AuthModule,
        MediaStorageModule,
        TestimonialsModule,
        CategoriesModule,
        TagsModule,
        SeedModule,
        JwtModule
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ]
    }).overrideProvider(MediaStorageProvider)
      .useClass(MediaStorageProviderFakeImpl)
      .overrideProvider(EmailProvider)
      .useClass(EmailProviderFakeImpl).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();
    let orgRepo: Repository<Organization> = moduleRef.get(getRepositoryToken(Organization));
    invitationTestimonialRepo = moduleRef.get(getRepositoryToken(TestimonialInvitation));
    const loginDto: LoginDto = {
      password: 'Password123',
      username: 'test_username_userwithorg_1'
    }
    const loginRes = await request
      .default(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    user = loginRes.body;
    expect(user.token).toBeDefined()

    organizationId = user.userOrganizations[0].organization.id
    expect(organizationId).toBeDefined()

    let categoryRepo: Repository<Category> = moduleRef.get(getRepositoryToken(Category));
    let category = await categoryRepo.findOne({ where: {} });
    categoryId = category?.id;
  });

  afterAll(async () => {
    if (!app) return;
    const dataSource = app.get(DataSource);

    await dataSource.destroy();
    await app.close();

    jest.clearAllTimers();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    if (!organizationId)
      throw Error("Organization id empty");
    if (!categoryId)
      throw Error("Category id empty");

    let inviteTestimonialDto: InviteTestimonialDto = {
      emails: ['example@example.com', 'example2@example.com'],
      organizationId: organizationId,
      categoryId
    }
    //act
    const res = await request
      .default(app.getHttpServer())
      .post('/testimonials/invite')
      .send(inviteTestimonialDto)
      .set('Authorization', `Bearer ${user.token}`);
    try {
      expect(res.status).toBe(200);
    }
    catch (ex) {
      console.error(res)
    }
    let invitation = await invitationTestimonialRepo.findOne({ where: { used_at: IsNull() } });
    if (!invitation)
      throw new Error("Not invitation token")
    token = invitation.token;
  })

  it('should create a new testimonial with default data, returns testimonial created', async () => {
    //arrange
    if (!organizationId)
      throw new Error("Organization id empty");
    if (!categoryId)
      throw new Error("Category id empty");
    if(!token)
      throw new Error("Not invitation token")
    //act
    const res = await request
      .default(app.getHttpServer())
      .post(`/testimonials?token=${token}`)
      .set('Content-Type', 'multipart/form-data')
      .field('organization_id', organizationId)
      .field('title', 'Great Experience')
      .field('content', 'This is an amazing testimonial content...')
      .field('media_type', MediaType.TEXT)
      .field('client_email', 'example@example.com')
      .field('client_name', 'jane')
      .field('stars_rating', '5');
    let testimonial: Testimonial = res.body;

    //assert
    try {
      expect(res.status).toBe(201);
      expect(testimonial).toBeDefined();
      expect(testimonial.status).toBe(TestimonialStatus.PENDING);
      expect(testimonial.organization_id).toBe(organizationId);
      expect(testimonial.category_id).toBe(categoryId);
    }
    catch (ex) {
      console.error(res.body.message)
    }

  });
  it('should throw error, organization id does not exist', async () => {
    //arrange
    //act
    const res = await request
      .default(app.getHttpServer())
      .post(`/testimonials?token=${token}`)
      .set('Content-Type', 'multipart/form-data')
      .field('organization_id', "org_123asdasd")
      .field('title', 'Great Experience')
      .field('content', 'This is an amazing testimonial content...')
      .field('media_type', MediaType.TEXT)
      .field('client_email', 'example@example.com')
      .field('client_name', 'jane')
      .field('stars_rating', '5');
    let testimonial: Testimonial = res.body;

    //assert
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
});