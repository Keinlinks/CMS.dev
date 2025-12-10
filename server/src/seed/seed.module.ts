import { Module, OnModuleInit } from "@nestjs/common";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/categories/entities/category.entity";
import { OrganizationRole } from "src/common/types/userRole";
import { Organization } from "src/organizations/entities/organization.entity";
import { CreateTestimonialDto } from "src/testimonials/dto/create-testimonial.dto";
import { Testimonial } from "src/testimonials/entities/testimonial.entity";
import { MediaType } from "src/testimonials/enums/mediaType";
import { TestimonialStatus } from "src/testimonials/enums/testimonialStatus";
import { UserOrganization } from "src/user_organization/entities/userOrganization.entity";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/services/users.service";
import { UsersModule } from "src/users/users.module";
import { Repository } from "typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([User, Organization, UserOrganization, Testimonial, Category]), UsersModule],
})
export class SeedModule implements OnModuleInit {
    constructor(
        private userService: UsersService,
        @InjectRepository(Organization) private orgRepo: Repository<Organization>,
        @InjectRepository(UserOrganization) private userOrgRepo: Repository<UserOrganization>,
        @InjectRepository(Testimonial) private testimonialRepo: Repository<Testimonial>,
        @InjectRepository(Category) private categoryRepo: Repository<Category>,
    ) { }
    async onModuleInit() {
        if (process.env.SEED_DB !== 'true')
            return;
        await this.run();
    }

    async run() {
        //create categories
        await this.createCategories();
        //cms user
        let user = await this.userService.findByUsernameOrEmail(`cms391547@gmail.com`);
        if (!user) {
            user = await this.userService.create({
                email: `cms391547@gmail.com`,
                password: "Password123",
                username: `cms`,
                name: `Test CMS user`
            });
        }

        // Create 5 random users
        await this.createUserWithoutOrg(10);
        await this.createUsersWithOneOrg(10);
        await this.createUsersWithManyOrgs(10);
    }

    async createUserWithoutOrg(count: number) {
        for (let i = 0; i < count; i++) {
            const email = `test${i + 1}@test.com`;
            const username = `test_username_${i + 1}`;

            let user = await this.userService.findByUsernameOrEmail(email);
            if (!user) {
                await this.userService.create({ email, password: "Password123", username, name: `Test User ${i + 1}` });
            }
        }
    }
    async createUsersWithOneOrg(count: number) {
        for (let i = 0; i < count; i++) {
            const email = `userwithorg${i + 1}@test.com`;
            const username = `test_username_userwithorg_${i + 1}`;

            let user = await this.userService.findByUsernameOrEmail(email);
            if (!user) {
                user = await this.userService.create({ email, password: "Password123", username, name: `Test Userwithorg ${i + 1}` });
            }
            let org = await this.orgRepo.findOne({ where: { name: `CMS Org ${i + 1}` } });
            if (org) continue;
            if (!org) {
                org = await this.orgRepo.save({ name: `CMS Org ${i + 1}`, description: `organization of CMS ${i + 1}` });
            }
            let category = await this.categoryRepo.findOne({ where: { name: "Service" } })
            await this.createTestimonials(3, org, category?.id || '');
            await this.userOrgRepo.save({ organizationId: org.id, userId: user.id, role: OrganizationRole.ADMINISTRATOR });
        }
    }

    async createUsersWithManyOrgs(count: number) {
        for (let i = 0; i < count; i++) {
            const email = `userwithManyOrg${i + 1}@test.com`;
            const username = `test_username_userwithmanyOrg_${i + 1}`;

            let user = await this.userService.findByUsernameOrEmail(email);
            if (!user) {
                user = await this.userService.create({ email, password: "Password123", username, name: `Test UserwithManyorg ${i + 1}` });
            }
            for (let j = 0; j < 2; j++) {
                let orgMany = await this.orgRepo.findOne({ where: { name: `CMS Many Org ${j + 1}` } });
                if (!orgMany) {
                    orgMany = await this.orgRepo.save({ name: `CMS Many Org ${j + 100}`, description: `organization of CMS ${j + 100}` });
                }
                let categoryMany = await this.categoryRepo.findOne({ where: { name: "Service" } })
                await this.createTestimonials(10, orgMany, categoryMany?.id || '');
                await this.userOrgRepo.save({ organizationId: orgMany.id, userId: user.id, role: OrganizationRole.EDITOR });
                let org = await this.orgRepo.findOne({ where: { name: `CMS Many-i Org ${i + 1}` } });
                if (org) continue;
                if (!org) {
                    org = await this.orgRepo.save({ name: `CMS Many-i Org ${i + 1}`, description: `organization of CMS ${i + 1}` });
                }
                let category = await this.categoryRepo.findOne({ where: { name: "Product" } })
                await this.createTestimonials(10, org, category?.id || '');
                await this.userOrgRepo.save({ organizationId: org.id, userId: user.id, role: OrganizationRole.ADMINISTRATOR });
            }

        }
    }

    async createTestimonials(count: number, organization: Organization, categoryId: string) {
        for (let i = 0; i < count; i++) {
            let userNumber = i + 1;
            let testimonial: Partial<Testimonial> = {
                content: `This is testimonial content for organization ${organization.name}`,
                media_type: MediaType.TEXT,
                category_id: categoryId,
                organization_id: organization.id,
                title: `Testimonial Title ${userNumber}`,
                stars_rating: Math.floor(Math.random() * 5) + 1,
                client_email: `client_${userNumber}@example.com`,
                client_name: `Client Name ${userNumber}`,
            }
            const exists = await this.testimonialRepo.findOne({
                where: { title: `Testimonial Title ${userNumber}`, organization_id: organization.id }
            });

            if (!exists) await this.testimonialRepo.save({ ...testimonial, status: this.randomStatus() });
        }
    }
    async createCategories() {
        const categoryServiceName = "Service";
        const categoryProductName = "Product"

        const categoryServiceExist = await this.categoryRepo.findOne({ where: { name:categoryServiceName} });
        if (!categoryServiceExist) {
            await this.categoryRepo.save({ name:categoryServiceName, description: `Service testimonial` });
        }

        const categoryProductExists = await this.categoryRepo.findOne({ where: { name:"Product" } });
        if (!categoryProductExists) {
            await this.categoryRepo.save({ name:categoryProductName, description: `Product testimonial` });
        }
    }
    private randomStatus(): TestimonialStatus {
        const values = Object.values(TestimonialStatus);
        const index = Math.floor(Math.random() * values.length);
        return values[index] as TestimonialStatus;
    }
}