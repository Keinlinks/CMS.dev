import { BaseEntity } from "src/common/entities/base.entity";
import { OrganizationRole } from "src/common/types/userRole";
import { Check, Column, CreateDateColumn, Entity, Index } from "typeorm";

@Entity('invitations')
export class Invitation extends BaseEntity {
    @Column()
    user_id: string;

    @Column()
    organizationId: string;

    // Sqlite does not support enum type, so using varchar with check instead (testing and local environment friendly)
    @Column({ type: 'varchar' })
    @Check(`role_asigned IN ('admin', 'editor')`)
    role_asigned: OrganizationRole;

    @Index()
    @Column()
    token_hashed: string;

    @Column()
    expires_at: Date;

    @CreateDateColumn({ nullable: true })
    used_at: Date | null;
}