import { BaseEntity } from "src/common/entities/base.entity";
import { OrganizationRole } from "src/common/types/userRole";
import { Organization } from "src/organizations/entities/organization.entity";
import { User } from "src/users/entities/user.entity";
import { Check, Column, Entity, JoinColumn, ManyToOne } from "typeorm";


@Entity('user_organization')
export class UserOrganization extends BaseEntity {
    @Column({nullable: false})
    userId: string;

    @Column({nullable: false})
    organizationId: string;

    // Sqlite does not support enum type, so using varchar with check instead (testing and local environment friendly)
    @Column({ type: 'varchar' })
    @Check(`role IN ('admin', 'editor')`)
    role: OrganizationRole; // e.g., 'admin', 'editor'

     @ManyToOne(() => User, user => user.userOrganizations)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Organization, org => org.userOrganizations)
    @JoinColumn({ name: 'organizationId' })
    organization: Organization;
}