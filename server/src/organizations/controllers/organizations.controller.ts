import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { OrganizationsService } from '../services/organizations.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AddUserOrganizationDto } from '../dto/add-userOrganiztion.dto';
import { ChangeRoleDto } from '../dto/update-userOrganiztion.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateOrganizationUseCase } from '../useCases/createOganization.useCase';
import { Organization } from '../entities/organization.entity';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly createOrganizationUseCase:CreateOrganizationUseCase
  ) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an organization. For upload a logo image, send a "file" field in multipart/form-data.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {}))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createorganizationDto: CreateOrganizationDto,
    @GetUser() user:User,
    @UploadedFile(new ParseFilePipeBuilder()
          .addMaxSizeValidator({ maxSize: 50 * 1024 * 1024 })
          .build({
            fileIsRequired: false,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          }),) file?: Express.Multer.File,
  ):Promise<Organization> {
    return this.createOrganizationUseCase.execute(createorganizationDto,user.id,file)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Retrieve a list of user's organizations" })
  findUserOrganizations(@GetUser() user: User) {
    return this.organizationsService.findUserOrganizations(user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseUUIDPipe) id: string,@GetUser() user:User) {
    return this.organizationsService.findOneSecured(id,user.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateorganizationDto: UpdateOrganizationDto,
    @GetUser() user:User
  ) {
    return this.organizationsService.update(id,user.id, updateorganizationDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string,@GetUser() user:User) {
    return this.organizationsService.remove(id,user.id);
  }

  //? ====================== USER ORGANIZATION =====================
  @Post(':orgId/users')
  @ApiBearerAuth()
  async addUserToOrganization(
    @Param('orgId') orgId: string,
    @Body() dto: AddUserOrganizationDto,
  ) {
    dto.organizationId = orgId;
    return await this.organizationsService.addUserOrganization(dto);
  }

  @Patch(':orgId/users/:userId/role')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeUserRole(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @Body() dto: ChangeRoleDto,
    @GetUser() user:User
  ) {
    await this.organizationsService.changeUserRole(orgId, userId, dto.role, user);
  }
  
  @Delete(':orgId/users/:userId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUserFromOrganization(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @GetUser() user:User
  ) {
    await this.organizationsService.removeUserFromOrganization(orgId, userId, user.id);
  }
}
