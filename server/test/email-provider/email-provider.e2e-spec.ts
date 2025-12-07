import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "src/common/guards/auth.guard";
import { ConfirmEmailTemplate } from "src/notifications/email-templates/confirmEmail.template";
import { NotificationsModule } from "src/notifications/notifications.module";
import { NotificationsService } from "src/notifications/services/notifications.service";
import { DataSource } from "typeorm";

describe.skip('Notifications integration', () => {
    let app: INestApplication;
    let emailProviderService: NotificationsService;

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
                NotificationsModule
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({ whitelist: true, transform: true }),
        );
        emailProviderService = moduleRef.get(NotificationsService);
        await app.init();
    });

    afterAll(async () => {
        const dataSource = app.get(DataSource);

        await dataSource.destroy();
        await app.close();

        jest.clearAllTimers();
        jest.resetAllMocks();
    });

    describe('EmailProviderService', () => {
        it('should send a welcome email', async () => {
            const emailProviderService = app.get(NotificationsService);
            let emailPayload = new ConfirmEmailTemplate("cms391547@gmail.com", "Test User", "sample-token-123");
            const response = await emailProviderService.sendNotificationWithTemplate(emailPayload)
            expect(response).toBeDefined();
            expect(response).toBe(true);
        });
    })
});