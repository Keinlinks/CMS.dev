import { BaseEntity } from 'src/common/entities/base.entity';
import { UserOrganization } from 'src/user_organization/entities/userOrganization.entity';
import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';

@Entity('organizations')
export class Organization extends BaseEntity {

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

 @Column({ type: 'varchar', nullable: true })
  logoUrl: string;

  @Column({ type: 'varchar', nullable: true })
  questionText: string;

  @OneToMany(() => UserOrganization, userOrg => userOrg.organization)
  userOrganizations: UserOrganization[];
}
