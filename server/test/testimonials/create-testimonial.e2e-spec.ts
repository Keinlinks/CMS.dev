import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/categories/entities/category.entity";
import { AuthGuard } from "src/common/guards/auth.guard";
import { MediaStorageModule } from "src/media-storage/mediaStorage.module";
import { Organization } from "src/organizations/entities/organization.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { TagsModule } from "src/tags/tags.module";
import { CreateTestimonialDto } from "src/testimonials/dto/create-testimonial.dto";
import { Testimonial } from "src/testimonials/entities/testimonial.entity";
import { MediaType } from "src/testimonials/enums/mediaType";
import { TestimonialsModule } from "src/testimonials/testimonials.module";
import { UserOrganization } from "src/user_organization/entities/userOrganization.entity";
import { User } from "src/users/entities/user.entity";
import * as request from 'supertest';
import { DataSource } from "typeorm";

describe.skip('Testimonials integration', () => {
  let app: INestApplication;

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
    // const createTestimonialDto: CreateTestimonialDto = {
    //   organitation_id: "org_12345",
    //   category_id: "550e8400-e29b-41d4-a716-446655440000",
    //   title: "Great Experience",
    //   content: "This is an amazing testimonial content that describes the wonderful experience I had with this service.",
    //   media_type: MediaType.TEXT
    // };
    // //act
    // const res = await request
    //   .default(app.getHttpServer())
    //   .post('/testimonials')
    //   .send(createTestimonialDto);
    // //assert
    // expect(res.status).toBe(201);
  });
});