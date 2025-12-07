import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({
        description: 'First name of the user.',
        example: 'John',
        nullable: true,
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        example: 'Doe',
        nullable: true,
        type: 'string',
        required: false
    })
    @IsString()
    @IsOptional()
    lastname?: string;
}