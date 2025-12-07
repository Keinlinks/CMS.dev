import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { NotificationsService } from "src/notifications/services/notifications.service";
import { OrganizationsService } from "src/organizations/services/organizations.service";
import { UserOrganizationService } from "src/user_organization/services/userOrganization.service";
import { InviteUserToOrganizationDto } from "../dto/inviteUserToOrganization.dto";
import { UsersService } from "src/users/services/users.service";
import { InvitationEmailTemplate } from "src/notifications/email-templates/invitation.template";
import { EncoderService } from "src/common/services/encoder.service";
import { OrganizationRole } from "src/common/types/userRole";
import { InvitationsService } from "../services/invitations.service";

@Injectable()
export class InviteUserToOrganizationUseCase {
    private readonly logger = new Logger(InviteUserToOrganizationUseCase.name);

    constructor(
        private readonly organizationsService: OrganizationsService,
        private readonly userOrganizationService: UserOrganizationService,
        private readonly userService: UsersService,
        private readonly invitationService: InvitationsService,
        private readonly notificationService: NotificationsService,
        private readonly encoderService: EncoderService,
    ) { }

    async execute(input: InviteUserToOrganizationDto, userId:string) {
        this.logger.log(`User ${userId} is inviting ${input.email} to organization ${input.organizationId}`);
        // Verify organization exists
        const organization = await this.organizationsService.findOneUnsafe(input.organizationId);
        if (!organization) throw new NotFoundException('Organization not found');
        // Verify user is admin of the organization
        const userOrg = await this.userOrganizationService.findUserOrganization(userId, input.organizationId);
        if(!userOrg || userOrg.role !== OrganizationRole.ADMINISTRATOR)
            throw new ConflictException('Only administrators can invite users to the organization');
        // Verify invited user exists
        const invitedUser = await this.userService.findByUsernameOrEmail(input.email);
        if (!invitedUser) throw new NotFoundException('User not found');

        // Verify user is not already in the organization
        const existsUserInOrg = await this.userOrganizationService.findUserOrganization(invitedUser.id, input.organizationId);
        if (existsUserInOrg) throw new ConflictException('User already member of the organization');

        const token = await this.encoderService.generateToken();

        let notification: InvitationEmailTemplate = new InvitationEmailTemplate({
            organizationName: organization.name,
            toEmail: invitedUser.email,
            token:token,
            username: invitedUser.username
        });

        let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await this.invitationService.createInvitation({
            organizationId: organization.id,
            role_asigned: input.role || OrganizationRole.EDITOR,
            expires_at: expiresAt,
            used_at: null,
            user_id: invitedUser.id,
            token_hashed: token
        });
        this.logger.log(`Invitation sent to ${input.email} to join organization ${input.organizationId}`);
        this.logger.debug(`Invitation details: ${JSON.stringify(notification)}`);
        return this.notificationService.sendNotificationWithTemplate(notification);
    }
}