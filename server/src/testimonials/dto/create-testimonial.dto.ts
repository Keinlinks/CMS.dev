import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsArray, IsEnum, MinLength, MaxLength, IsInt, Min, Max, IsEmail } from 'class-validator';
import { MediaType } from '../enums/mediaType';
import { TestimonialStatus } from '../enums/testimonialStatus';
import { Transform, Type } from 'class-transformer';

export class CreateTestimonialDto {
  @ApiPropertyOptional({
    description: 'Email of the client submitting the testimonial.',
    example: "client_1@example.com"
  })
  @IsNotEmpty({ message: 'Client email is required' })
  @IsEmail({}, { message: 'Client email must be a valid email address' })
  client_email: string;
  @ApiProperty({
    description: 'Name of the client submitting the testimonial.',
    example: 'John Doe',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty({ message: 'Client name is required' })
  client_name: string;

  @ApiProperty({
    description: 'ID of the organization submitting the testimonial.',
    example: 'org_12345',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty({ message: 'Organization ID is required' })
  organization_id: string;

  @ApiProperty({
    description: 'Title of the testimonial (between 3 and 255 characters).',
    example: 'Amazing service!',
    type: 'string',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters' })
  title: string;

  @ApiProperty({
    description: 'Main content of the testimonial.',
    example: 'The experience was incredible and the staff was very helpful.',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @ApiPropertyOptional({
    description: 'Type of media attached to the testimonial.',
    example: MediaType.TEXT,
    enum: MediaType,
    nullable: false,
    default: MediaType.TEXT,
  })
  @IsNotEmpty({ message: 'Media type cannot be empty if provided' })
  @IsEnum(MediaType, { message: 'Media type must be: image or video' })
  media_type: MediaType = MediaType.TEXT;

  @ApiPropertyOptional({
    description: 'Star rating for the testimonial. Must be an integer between 1 and 5.',
    example: 5,
    type: Number,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Minimum rating is 1' })
  @Max(5, { message: 'Maximum rating is 5' })
  @Type(() => Number)
  stars_rating?: number;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'uuid' },
    example: ['ec97b2a3-5b9e-4c11-8ec9-2f7b4e9af8d4', '57c4c242-9f67-4d7a-b122-33cf10c1e3d0']
  })
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(',').map(v => v.trim());
  })
  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsUUID('4', { each: true, message: 'Each tag must be a valid UUID' })
  tagIds?: string[] = [];
}