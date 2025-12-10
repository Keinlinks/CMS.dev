import { IsNotEmpty } from "class-validator";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, CreateDateColumn, Entity, Index } from "typeorm";


@Entity('testimonial_invitations')
export class TestimonialInvitation extends BaseEntity {
    @Column({ type: 'varchar', nullable: false })
    email: string;
    
    @Index()
    @Column({ type: 'varchar', nullable: false })
    token: string;

    @Column()
    categoryId:string;

    @Column({nullable: false})
    organizationId:string;

    @CreateDateColumn({nullable: false})
    expires_at: Date;

    @CreateDateColumn({nullable: true})
    used_at: Date | null;

    markAsUsed(){
        this.used_at = new Date();
    }
}