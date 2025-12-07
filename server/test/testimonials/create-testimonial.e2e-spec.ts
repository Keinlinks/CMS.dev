import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/categories/entities/category.entity";
import { AuthGuard } from "src/common/guards/auth.guard";
import { MediaStorageModule } from "src/media-storage/mediaStorage.module";
import { Organization } from "src/organizations/entities/organization.entity";
import { SeedModule } from "src/seed/seed.module";
import { Tag } from "src/tags/entities/tag.entity";
import { TagsModule } from "src/tags/tags.module";
import { CreateTestimonialDto } from "src/testimonials/dto/create-testimonial.dto";
import { Testimonial } from "src/testimonials/entities/testimonial.entity";
import { MediaType } from "src/testimonials/enums/mediaType";
import { TestimonialStatus } from "src/testimonials/enums/testimonialStatus";
import { TestimonialsModule } from "src/testimonials/testimonials.module";
import { UserOrganization } from "src/user_organization/entities/userOrganization.entity";
import { User } from "src/users/entities/user.entity";
import * as request from 'supertest';
import { DataSource, Repository } from "typeorm";

describe('Testimonials integration', () => {
  let app: INestApplication;
  let organizationId: string | undefined;
  let categoryId: string | undefined;

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
        MediaStorageModule,
        TestimonialsModule,
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
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();
    let orgRepo: Repository<Organization> = moduleRef.get(getRepositoryToken(Organization));
    let org = await orgRepo.findOne({ where: {} });
    organizationId = org?.id;

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

  it('should create a new testimonial with default data, returns testimonial created', async () => {
    //arrange
    if (!organizationId)
      throw Error("Organization id empty");
    if (!categoryId)
      throw Error("Category id empty");

    //act
    const res = await request
      .default(app.getHttpServer())
      .post('/testimonials')
      .set('Content-Type', 'multipart/form-data')
      .field('organization_id', organizationId)
      .field('category_id', categoryId)
      .field('title', 'Great Experience')
      .field('content', 'This is an amazing testimonial content...')
      .field('media_type', MediaType.TEXT)
      .field('client_email', 'example@example.com')
      .field('client_name', 'jane')
      .field('stars_rating', '5');
    let testimonial:Testimonial = res.body;

    //assert
    expect(res.status).toBe(201);
    expect(testimonial).toBeDefined();
    expect(testimonial.status).toBe(TestimonialStatus.PENDING);
    expect(testimonial.organization_id).toBe(organizationId);
    expect(testimonial.category_id).toBe(categoryId);
  });
  it('should throw error, bad request categry_id', async () => {
    //arrange
    if (!organizationId)
      throw Error("Organization id empty");
    if (!categoryId)
      throw Error("Category id empty");

    //act
    const res = await request
      .default(app.getHttpServer())
      .post('/testimonials')
      .set('Content-Type', 'multipart/form-data')
      .field('organization_id', organizationId)
      .field('categry_id', categoryId)
      .field('title', 'Great Experience')
      .field('content', 'This is an amazing testimonial content...')
      .field('media_type', MediaType.TEXT)
      .field('client_email', 'example@example.com')
      .field('client_name', 'jane')
      .field('stars_rating', '5');
    let testimonial:Testimonial = res.body;
    
    //assert
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });
  it('should throw error, organization id does not exist', async () => {
    //arrange
    if (!organizationId)
      throw Error("Organization id empty");
    if (!categoryId)
      throw Error("Category id empty");

    //act
    const res = await request
      .default(app.getHttpServer())
      .post('/testimonials')
      .set('Content-Type', 'multipart/form-data')
      .field('organization_id', "org_123")
      .field('category_id', categoryId)
      .field('title', 'Great Experience')
      .field('content', 'This is an amazing testimonial content...')
      .field('media_type', MediaType.TEXT)
      .field('client_email', 'example@example.com')
      .field('client_name', 'jane')
      .field('stars_rating', '5');
    let testimonial:Testimonial = res.body;
    
    //assert
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
});