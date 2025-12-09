import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Organization } from '../entities/organization.entity';
import { UserOrganization } from 'src/user_organization/entities/userOrganization.entity';
import { User } from 'src/users/entities/user.entity';
import { OrganizationRole } from 'src/common/types/userRole';
import { AddUserOrganizationDto } from '../dto/add-userOrganiztion.dto';
import { MediaStorageService } from 'src/media-storage/services/mediaStorage.service';
import { UserOrganizationService } from 'src/user_organization/services/userOrganization.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private dataSource: DataSource,
    private readonly mediaStorageService: MediaStorageService,
    private readonly userOrganizationService: UserOrganizationService
  ) { }

  async create(name: string, description: string, questionText: string, logoUrl: string | undefined): Promise<Organization> {
    let organization = this.organizationRepository.create({
      name,
      description,
      logoUrl: logoUrl || '',
      questionText
    });
    return await this.organizationRepository.save(organization);
  }

  async findUserOrganizations(userId: string): Promise<Organization[]> {
    const organizations = await this.organizationRepository.find({
      relations: {
        userOrganizations: {
          user: true
        }
      },
      where: {
        userOrganizations: {
          userId: userId
        }
      }
    });

    return organizations;
  }

  async findOneSecured(organizationId: string, userId: string): Promise<Organization> {
    let userOrg = await this.userOrganizationService.findUserOrganization(userId, organizationId);
    if (!userOrg) {
      throw new UnauthorizedException(`User is not part of the organization ${organizationId}`);
    }
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
      relations: ['userOrganizations'],
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }
    return organization;
  }

  async findOneUnsafe(organizationId: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
      relations: ['userOrganizations'],
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }
    return organization;
  }

  async update(organizationId: string, userId: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    let userOrg = await this.userOrganizationService.findUserOrganization(userId, organizationId);
    if (!userOrg) {
      throw new UnauthorizedException(`User is not part of the organization ${organizationId}`);
    }
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
      relations: ['userOrganizations'],
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }
    Object.assign(organization, updateOrganizationDto);
    return this.organizationRepository.save(organization);
  }

  async remove(organizationId: string, userId: string,): Promise<void> {
    let userOrg = await this.userOrganizationService.findUserOrganization(userId, organizationId);
    if (!userOrg) {
      throw new UnauthorizedException(`User is not part of the organization ${organizationId}`);
    }
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
      relations: ['userOrganizations'],
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }
    await this.organizationRepository.remove(organization);
  }
  //? ====================== USER ORGANIZATION =====================
  async addUserOrganization(addDto: AddUserOrganizationDto): Promise<UserOrganization> {
    const existsOrganization = await this.organizationRepository.findOne({ where: { id: addDto.organizationId } });
    if (!existsOrganization) throw new NotFoundException('Organization not found');

    const existsUserInOrg = await this.userOrganizationService.findUserOrganization(addDto.userId, addDto.organizationId);
    if (existsUserInOrg) throw new ConflictException('User already member of the organization');

    const userOrg = this.userOrganizationService.create({
      userId: addDto.userId,
      organizationId: addDto.organizationId,
      role: addDto.role ?? OrganizationRole.EDITOR,
    });

    return userOrg;
  }

  async changeUserRole(
    organizationId: string,
    targetUserId: string,
    newRole: OrganizationRole,
    user: User
  ): Promise<UserOrganization> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (user.id === targetUserId) {
      throw new BadRequestException("Administrators cannot change their own role");
    }
    try {
      const membership = await queryRunner.manager.findOne(UserOrganization, {
        where: { organizationId, userId: targetUserId },
      });
      if (!membership) {
        throw new NotFoundException('User is not a member of the organization');
      }

      const currentUser = await queryRunner.manager.findOne(UserOrganization, {
        where: { organizationId, userId: user.id },
      });
      if (currentUser?.role === OrganizationRole.EDITOR) {
        throw new BadRequestException("The current user doesn't have permissions to change the role");
      }

      if (membership.role === newRole) {
        await queryRunner.commitTransaction();
        return membership;
      }

      // If demoting an admin, ensure org will still have at least one admin
      if (membership.role === OrganizationRole.ADMINISTRATOR && newRole !== OrganizationRole.ADMINISTRATOR) {
        const adminCount = await queryRunner.manager.count(UserOrganization, {
          where: { organizationId, role: OrganizationRole.ADMINISTRATOR },
        });
        if (adminCount <= 1) {
          throw new ConflictException('Cannot remove the last administrator of the organization');
        }
      }

      membership.role = newRole;
      const saved = await queryRunner.manager.save(membership);

      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async removeUserFromOrganization(
    organizationId: string,
    targetUserId: string,
    actorUserId?: string,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const membership = await queryRunner.manager.findOne(UserOrganization, {
        where: { organizationId, userId: targetUserId },
      });

      if (!membership) {
        throw new NotFoundException('User is not a member of the organization');
      }

      // If removing an admin, ensure we don't remove last admin
      if (membership.role === OrganizationRole.ADMINISTRATOR) {
        const adminCount = await queryRunner.manager.count(UserOrganization, {
          where: { organizationId, role: OrganizationRole.ADMINISTRATOR },
        });
        if (adminCount <= 1) {
          throw new ConflictException('Cannot remove the last administrator of the organization');
        }
      }

      //removing themselves
      // if (actorUserId === targetUserId) throw new BadRequestException('Admins cannot remove themselves');

      await queryRunner.manager.remove(membership);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
