import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { UserOrganizationService } from "src/user_organization/services/userOrganization.service";
import { OrganizationsService } from "src/organizations/services/organizations.service";
import { InvitationsService } from "../services/invitations.service";

@Injectable()
export class AcceptInvitationUseCase {
  private readonly logger = new Logger(AcceptInvitationUseCase.name);
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly userOrganizationService: UserOrganizationService,
    private readonly invitationsService: InvitationsService,
  ) { }

  async execute(token: string) {
    const invitation = await this.invitationsService.findByHashedToken(token);
    if(!invitation) throw new NotFoundException('Invitation not found');
    
    const existsOrganization = await this.organizationsService.findOneUnsafe(invitation.organizationId);
    if (!existsOrganization) throw new NotFoundException('Organization not found');

    const existsUserInOrg = await this.userOrganizationService.findUserOrganization(invitation.user_id, invitation.organizationId);
    if (existsUserInOrg) throw new ConflictException('User already member of the organization');

    const userOrganization = await this.userOrganizationService.create({
      userId: invitation.user_id,
      organizationId: invitation.organizationId,
      role: invitation.role_asigned,
    });
    invitation.used_at = new Date();
    await this.invitationsService.updateInvitation(invitation);
    this.logger.log(`User ${invitation.user_id} accepted invitation to join organization ${invitation.organizationId}`);
    return userOrganization;
  }
}