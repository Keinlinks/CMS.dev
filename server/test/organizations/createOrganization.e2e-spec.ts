import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "src/app.module";
import { LoginDto } from "src/auth/dto/login.dto";
import { OrganizationRole } from "src/common/types/userRole";
import { EmailProviderFakeImpl } from "src/notifications/adapters/emailProviderFakeImpl";
import { EmailProvider } from "src/notifications/ports/emailProvider";
import { CreateOrganizationDto } from "src/organizations/dto/create-organization.dto";
import { Organization } from "src/organizations/entities/organization.entity";
import { UserOrganization } from "src/user_organization/entities/userOrganization.entity";
import * as request from 'supertest';
import { DataSource, Repository } from "typeorm";

describe('Organization integration', () => {
    let app: INestApplication;
    let user: any;
    let orgRepo:Repository<Organization>
    let userOrgRepo:Repository<UserOrganization>
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                    isGlobal: true,
                }),
                AppModule
            ],
        }).overrideProvider(EmailProvider)
            .useClass(EmailProviderFakeImpl)
            .compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({ whitelist: true, transform: true }),
        );
        orgRepo = moduleRef.get(getRepositoryToken(Organization));
        userOrgRepo = moduleRef.get(getRepositoryToken(UserOrganization));
        await app.init();
        const loginInput: LoginDto = {
            password: 'Password123',
            username: "cms391547@gmail.com",
        };
        const loginRes1 = await request
            .default(app.getHttpServer())
            .post('/auth/login')
            .send(loginInput);
        user = loginRes1.body;
    }, 60000);

    afterAll(async () => {
        const dataSource = app.get(DataSource);

        await dataSource.destroy();
        await app.close();

        jest.clearAllTimers();
        jest.resetAllMocks();
    });

    describe("Organization", () => {
        it("should createa a new organization", async () => {
            const createOrg: CreateOrganizationDto = {
                description: "description",
                name: "org_123",
                questionText: ""
            };
            let result = await request
                .default(app.getHttpServer())
                .post('/organizations')
                .set('Authorization', `Bearer ${user.token}`)
                .field('description', createOrg.description)
                .field('name', createOrg.name)
                .field('questionText', createOrg.questionText);
            let org:Organization = result.body;
            expect(result.status).toBe(201);
            expect(org).toBeDefined();
            expect(org.id).toBeDefined();

            let exist = await orgRepo.findOne({where: {id:org.id}});
            expect(exist).toBeDefined();
            let userExistInOrg = await userOrgRepo.findOne({where:{userId:user.id, organizationId:org.id}})
            expect(userExistInOrg).toBeDefined();
            expect(userExistInOrg?.role).toBe(OrganizationRole.ADMINISTRATOR)

        })
    })
});