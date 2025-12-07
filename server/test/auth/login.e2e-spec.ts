import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { OrganizationModule } from 'src/organizations/organitations.module';
import { UserOrganizationModule } from 'src/user_organization/userOrganization.module';
import { MediaStorageProvider } from 'src/media-storage/ports/mediaStorageProvider';
import { MediaStorageProviderFakeImpl } from 'src/media-storage/adapters/mediaStorageProviderFakeImpl';
import { EmailProvider } from 'src/notifications/ports/emailProvider';
import { EmailProviderFakeImpl } from 'src/notifications/adapters/emailProviderFakeImpl';
import { DataSource } from 'typeorm';

describe('Auth integration', () => {
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
        UsersModule,
        OrganizationModule,
        UserOrganizationModule,
        AuthModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
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
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);

    await dataSource.destroy();
    await app.close();

    jest.clearAllTimers();
    jest.resetAllMocks();
  });

  it('should register a new user', async () => {
    //arrange
    const registerDto: RegisterDto = {
      password: 'Password123',
      username: 'test_1',
      email: 'test_1@test.com',
      lastname: 'test',
      name: 'test',
    };
    //act
    const res = await request
      .default(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);
    //assert
    expect(res.status).toBe(201);
  });
  it('should throw exception, email not valid', async () => {
    //arrange
    const registerDto: RegisterDto = {
      password: 'Password123',
      username: 'test_2',
      email: 'testtest.com',
      lastname: 'test',
      name: 'test',
    };
    //act
    const res = await request
      .default(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);
    //assert
    expect(res.status).toBe(400);
  });

  it('should login and return token', async () => {
    //arrange
    const loginInput: LoginDto = {
      password: 'Password123',
      username: 'test_3',
    };
    const registerDto: RegisterDto = {
      password: 'Password123',
      username: 'test_3',
      email: 'test_3@test.com',
      lastname: 'test',
      name: 'test',
    };
    //act
    await request
      .default(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    const res = await request
      .default(app.getHttpServer())
      .post('/auth/login')
      .send(loginInput);
    //assert
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
  it('should throw unauthorized exception, bad password', async () => {
    //arrange
    const loginInput: LoginDto = {
      password: 'Password123',
      username: 'test_4',
    };
    const registerDto: RegisterDto = {
      password: 'Password12',
      username: 'test_4',
      email: 'test_4@test.com',
      lastname: 'test',
      name: 'test',
    };
    //act
    await request
      .default(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    const res = await request
      .default(app.getHttpServer())
      .post('/auth/login')
      .send(loginInput);
    //assert
    expect(res.status).toBe(401);
  });

  it('valikdate token: should return not authorized error', async () => {
    //act
    let res = await request
      .default(app.getHttpServer())
      .get('/auth/validate-token')
    //assert
    expect(res.status).toBe(401);
  });

  it('validate token: should return 200 code', async () => {
    //arrange
    const loginInput: LoginDto = {
      password: 'Password123',
      username: 'test_5',
    };
    const registerDto: RegisterDto = {
      password: 'Password123',
      username: 'test_5',
      email: 'test_5@test.com',
      lastname: 'test',
      name: 'test',
    };
    //act
    await request
      .default(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    const loginRes = await request
      .default(app.getHttpServer())
      .post('/auth/login')
      .send(loginInput);
    const token = loginRes.body.token;

    let res = await request
      .default(app.getHttpServer())
      .get('/auth/validate-token')
      .set('Authorization', `Bearer ${token}`);
    //assert
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
