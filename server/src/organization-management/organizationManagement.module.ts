import { Module } from '@nestjs/common';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrganizationManagementController } from './controllers/organizationManagement.controller';
import { AcceptInvitationService } from './services/acceptInvitation.service';
import { InviteUserToOrganizationService } from './services/inviteUserToOrganization.service';
import { InvitationsService } from './services/invitations.service';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { OrganizationModule } from 'src/organizations/organitations.module';
import { UserOrganizationModule } from 'src/user_organization/userOrganization.module';
import { Invitation } from './entities/invitations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EjectUserFromOrganizationService } from './services/ejectUserFromOrganization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation]),NotificationsModule,CommonModule,UsersModule,OrganizationModule,UserOrganizationModule],
  controllers: [OrganizationManagementController],
  providers: [AcceptInvitationService,InviteUserToOrganizationService, EjectUserFromOrganizationService, InvitationsService],
  exports: [],
})
export class OrganizationManagementModule {}