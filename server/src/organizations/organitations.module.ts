import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationsController } from './controllers/organizations.controller';
import { OrganizationsService } from './services/organizations.service';
import { MediaStorageModule } from 'src/media-storage/mediaStorage.module';
import { UserOrganizationModule } from 'src/user_organization/userOrganization.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organization]),MediaStorageModule, UserOrganizationModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationModule {}
