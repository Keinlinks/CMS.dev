import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { LoginDto } from "src/auth/dto/login.dto";
import { Category } from "src/categories/entities/category.entity";
import { AuthGuard } from "src/common/guards/auth.guard";
import { OrganizationRole } from "src/common/types/userRole";
import { MediaStorageProviderFakeImpl } from "src/media-storage/adapters/mediaStorageProviderFakeImpl";
import { MediaStorageModule } from "src/media-storage/mediaStorage.module";
import { MediaStorageProvider } from "src/media-storage/ports/mediaStorageProvider";
import { EmailProviderFakeImpl } from "src/notifications/adapters/emailProviderFakeImpl";
import { EmailProvider } from "src/notifications/ports/emailProvider";
import { Organization } from "src/organizations/entities/organization.entity";
import { SeedModule } from "src/seed/seed.module";
import { TagsModule } from "src/tags/tags.module";
import { InviteTestimonialDto } from "src/testimonials/dto/invite-testimonial.dto";
import { TestimonialsModule } from "src/testimonials/testimonials.module";
import { UserOrganization } from "src/user_organization/entities/userOrganization.entity";
import * as request from 'supertest';
import { DataSource, Repository } from "typeorm";

describe('Testimonials invite', () => {
    let app: INestApplication;
    let organizationId: string | undefined;
    let categoryId: string | undefined;
    let token: string;

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
                AuthModule,
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
            .useClass(EmailProviderFakeImpl)
            .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({ whitelist: true, transform: true }),
        );

        await app.init();
        const loginDto: LoginDto = {
            password: 'Password123',
            username: 'test_username_userwithmanyOrg_1'
        }
        const res = await request
            .default(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto);
        let user = res.body;
        token = user.token;
        if (!token)
            throw Error("Token undefined")
        let userOrgRepo: Repository<UserOrganization> = moduleRef.get(getRepositoryToken(UserOrganization));
        let userOrg = await userOrgRepo.findOne({ where: { userId: user.id, role: OrganizationRole.ADMINISTRATOR } });
        organizationId = userOrg?.organizationId;

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

    it('should invite a 2 clients to create a testimonial', async () => {
        //arrange
        if (!organizationId)
            throw Error("Organization id empty");
        if (!categoryId)
            throw Error("Category id empty");

        let inviteTestimonialDto: InviteTestimonialDto = {
            emails: ['example@example.com', 'example2@example.com'],
            organizationId: organizationId
        }
        //act
        const res = await request
            .default(app.getHttpServer())
            .post('/testimonials/invite')
            .send(inviteTestimonialDto)
            .set('Authorization', `Bearer ${token}`);;
        //assert
        expect(res.status).toBe(HttpStatus.OK);
    });

    it('should invite a client to create a testimonial', async () => {
        //arrange
        if (!organizationId)
            throw Error("Organization id empty");
        if (!categoryId)
            throw Error("Category id empty");

        let inviteTestimonialDto: InviteTestimonialDto = {
            emails: ['example@example.com'],
            organizationId: organizationId
        }
        //act
        const res = await request
            .default(app.getHttpServer())
            .post('/testimonials/invite')
            .send(inviteTestimonialDto)
            .set('Authorization', `Bearer ${token}`);
        //assert
        expect(res.status).toBe(HttpStatus.OK);
    });

    it('should throw a error, not emails in payload', async () => {
        //arrange
        if (!organizationId)
            throw Error("Organization id empty");
        if (!categoryId)
            throw Error("Category id empty");


        let inviteTestimonialDto: InviteTestimonialDto = {
            emails: [],
            organizationId: organizationId
        }
        //act
        const res = await request
            .default(app.getHttpServer())
            .post('/testimonials/invite')
            .send(inviteTestimonialDto)
            .set('Authorization', `Bearer ${token}`);
        //assert
        expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should throw a error, organization does not exist', async () => {
        //arrange
        if (!organizationId)
            throw Error("Organization id empty");
        if (!categoryId)
            throw Error("Category id empty");

        let inviteTestimonialDto: InviteTestimonialDto = {
            emails: ['example@example.com', 'example2@example.com'],
            organizationId: "org_123123"
        }
        //act
        const res = await request
            .default(app.getHttpServer())
            .post('/testimonials/invite')
            .send(inviteTestimonialDto)
            .set('Authorization', `Bearer ${token}`);
        //assert
        expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
});