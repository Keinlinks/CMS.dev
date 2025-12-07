import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { OrganizationRole } from "src/common/types/userRole";
import { UserOrganizationService } from "src/user_organization/services/userOrganization.service";


export class EjectUserFromOrganizationUseCase {
    
    constructor(private userOrganizationService: UserOrganizationService) { }

    async execute(ejectUserId: string, adminUserId: string, organizationId: string) {
        if (ejectUserId === adminUserId)
            throw new ForbiddenException('An administrator cannot eject themselves');

        let adminOrg = await this.userOrganizationService.findUserOrganization(adminUserId, organizationId);
        if (!adminOrg || adminOrg.role !== OrganizationRole.ADMINISTRATOR)
            throw new ForbiddenException('Only administrators can eject users from the organization');

        let ejectUserOrg = await this.userOrganizationService.findUserOrganization(ejectUserId, organizationId);
        if (!ejectUserOrg)
            throw new NotFoundException('User is not a member of the organization');
        if (ejectUserOrg.role === OrganizationRole.ADMINISTRATOR)
            throw new ForbiddenException('Cannot eject another administrator');

        let deleteResult = await this.userOrganizationService.delete(ejectUserId, organizationId);

        return {
            success: deleteResult,
            message: `User ${ejectUserId} ejected from organization ${organizationId}`
        };
    }
}