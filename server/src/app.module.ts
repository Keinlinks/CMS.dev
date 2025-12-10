import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { UserOrganizationModule } from './user_organization/userOrganization.module';
import { OrganizationModule } from './organizations/organitations.module';
import { MediaStorageModule } from './media-storage/mediaStorage.module';
import { OrganizationManagementModule } from './organization-management/organizationManagement.module';
import { SeedModule } from './seed/seed.module';
import { ensureDatabase } from './common/services/ensure-database';
import { ObservabilityModule } from 'src/observability/observability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const env = config.get('NODE_ENV');

        const isLocal = env === 'development';

        if (isLocal) {
          return {
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            autoLoadEntities: true,
            synchronize: true,
          };
        }
        await ensureDatabase();
        return {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT || '5432'),
          username: process.env.DATABASE_USER || 'postgres',
          password: process.env.DATABASE_PASSWORD || 'postgres',
          database: process.env.DATABASE_NAME || 'cms_db',
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          migrations: [__dirname + '/migrations/*{.js,.ts}'],
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    TestimonialsModule,
    CategoriesModule,
    TagsModule,
    AuthModule,
    UserOrganizationModule,
    OrganizationModule,
    MediaStorageModule,
    OrganizationManagementModule,
    ObservabilityModule,
    SeedModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }


    //  TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: process.env.DATABASE_URL,
    //   host: process.env.DATABASE_HOST || 'localhost',
    //   port: parseInt(process.env.DATABASE_PORT || '5432'),
    //   username: process.env.DATABASE_USER || 'postgres',
    //   password: process.env.DATABASE_PASSWORD || 'postgres',
    //   database: process.env.DATABASE_NAME || 'cms_db',
    //   autoLoadEntities:true,
    //   synchronize: true,
    //   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // }),