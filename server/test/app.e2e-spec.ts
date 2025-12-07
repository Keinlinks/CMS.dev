import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { MediaStorageProviderFakeImpl } from "src/media-storage/adapters/mediaStorageProviderFakeImpl";
import { MediaStorageProvider } from "src/media-storage/ports/mediaStorageProvider";
import { EmailProviderFakeImpl } from "src/notifications/adapters/emailProviderFakeImpl";
import { EmailProvider } from "src/notifications/ports/emailProvider";
import * as request from 'supertest';
import { DataSource } from "typeorm";

describe('App integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true,
      }), AppModule]
    })
      .overrideProvider(MediaStorageProvider)
      .useClass(MediaStorageProviderFakeImpl)
      .overrideProvider(EmailProvider)
      .useClass(EmailProviderFakeImpl)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();
  }, 60000);

  afterAll(async () => {
    if (!app) return;
    const dataSource = app.get(DataSource);

    await dataSource.destroy();
    await app.close();

    jest.clearAllTimers();
    jest.resetAllMocks();
  });

  it('should run the app', async () => {
    const res = await request
      .default(app.getHttpServer())
      .get('/health')
    expect(res.status).toBe(200);
  });
});