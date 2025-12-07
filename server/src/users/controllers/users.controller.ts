import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  findMe(@GetUser() user:User) {
    return this.usersService.findOneWithOrganizations(user.id);
  }

  @Patch()
  @ApiBearerAuth()
  updateMe(
    @GetUser() user:User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }
}
