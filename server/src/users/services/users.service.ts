import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneWithOrganizations(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
      userOrganizations: {
        organization: true
      }
    }});
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsernameOrEmail(value: string): Promise<User | null> {
  return this.usersRepository.findOne({
    where: [
      { username: value },
      { email: value },
    ],
  });
}
  async findByEmail(value: string): Promise<User | null> {
  return this.usersRepository.findOne({
    where: [
      { email: value },
    ],
  });
}
  async findByUsername(value: string): Promise<User | null> {
  return this.usersRepository.findOne({
    where: [
      { username: value },
    ],
  });
}

  async findOneWithPassword(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [
        { username: username },
        { email: username },
      ],
      relations: { userOrganizations: { organization: true } },
      select: ['id', 'createdAt', 'updatedAt', 'email', 'username', 'password', 'name', 'userOrganizations'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [{ id }
      ],
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    /* if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }*/

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
