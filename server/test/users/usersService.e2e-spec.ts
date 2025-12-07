import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/categories/entities/category.entity";
import { OrganizationRole } from "src/common/types/userRole";
import { MediaStorageProviderFakeImpl } from "src/media-storage/adapters/mediaStorageProviderFakeImpl";
import { MediaStorageProvider } from "src/media-storage/ports/mediaStorageProvider";
import { EmailProviderFakeImpl } from "src/notifications/adapters/emailProviderFakeImpl";
import { EmailProvider } from "src/notifications/ports/emailProvider";
import { Organization } from "src/organizations/entities/organization.entity";
import { OrganizationModule } from "src/organizations/organitations.module";
import { Tag } from "src/tags/entities/tag.entity";
import { Testimonial } from "src/testimonials/entities/testimonial.entity";
import { UserOrganization } from "src/user_organization/entities/userOrganization.entity";
import { UserOrganizationModule } from "src/user_organization/userOrganization.module";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/services/users.service";
import { UsersModule } from "src/users/users.module";
import { Repository, DataSource } from "typeorm";

describe('UsersService integration', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let service: UsersService;
  let usersRepo: Repository<User>;
  let orgRepo: Repository<Organization>;
  let userOrgRepo: Repository<UserOrganization>;

  let mockUser = {} as User;
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
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
        OrganizationModule,
        UserOrganizationModule
      ],
      providers: [
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    service = moduleRef.get(UsersService);
    usersRepo = moduleRef.get(getRepositoryToken(User));
    orgRepo = moduleRef.get(getRepositoryToken(Organization));
    userOrgRepo = moduleRef.get(getRepositoryToken(UserOrganization));
    await app.init();
  });
  beforeAll(async () => {
    //Load Mock data to repositories for the tests

    // Create a mock user
    const dto: CreateUserDto = { email: 'a@a.com', password: '1234567', username: "Usertest", name: "usertest" };
    mockUser = await service.create(dto);
    expect(mockUser).toBeDefined();
    // Create a mock organization and link to user
    const org = orgRepo.create({ name: "Organization1", description: "Org 1 description", questionText: "" });
    await orgRepo.save(org);
    await userOrgRepo.save({
      organizationId: org.id,
      userId: mockUser.id,
      role: OrganizationRole.ADMINISTRATOR
    });

    //Create another organization standalone
    const org2 = orgRepo.create({ name: "Organization2", description: "Org 2 description", questionText: "" });
    await orgRepo.save(org2);
  })
  afterAll(async () => {
    if (!app) return;
    const dataSource = app.get(DataSource);

    await dataSource.destroy();
    await app.close();

    jest.clearAllTimers();
    jest.resetAllMocks();
  });

  describe("Create", () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = { email: 'test_1@test.com', password: '1234567', username: "User_test_1", name: "user_test_1" };

      const result = await service.create(dto);

      const user = await usersRepo.findOne({ where: { id: result.id } });
      expect(user).toBeDefined();
    });
  })
  describe("Find user", () => {
    it('should returns user info without organization', async () => {
      const foundUser = await service.findOne(mockUser.id);
      expect(foundUser).toBeDefined();
      expect(foundUser.userOrganizations).toBeUndefined();
    });
    it('should returns user with organization', async () => {
      const foundUser = await service.findOneWithOrganizations(mockUser.id);
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(mockUser.id);
      expect(foundUser.userOrganizations).toBeDefined();
      //Ensure that password is not returned
      expect(foundUser.password).toBeUndefined();
    });
    it('should returns user with password', async () => {
      const foundUser = await service.findOneWithPassword(mockUser.username);
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(mockUser.id);
      expect(foundUser?.password).toBeDefined();
    });
    it('should returns user, find with email', async () => {
      const foundUser = await service.findByUsernameOrEmail(mockUser.email);
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(mockUser.id);
      expect(foundUser?.password).toBeUndefined();
    });
    it('should returns user, find with username', async () => {
      const foundUser = await service.findByUsernameOrEmail(mockUser.username);
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(mockUser.id);
      expect(foundUser?.password).toBeUndefined();
    });
  })
});