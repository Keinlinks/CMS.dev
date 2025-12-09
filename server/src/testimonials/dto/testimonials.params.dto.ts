import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { TestimonialStatus } from "../enums/testimonialStatus";
import { QueryParamsDto } from "src/common/dto/queryParams.dto";
import { Type } from "class-transformer";

export class TestimonialsParamsDto extends QueryParamsDto {
  @ApiProperty({
    description: 'ID of the organization to get testimonials.',
    example: '61dd833b-54df-407e-b9e7-b8e1a5484c8d',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty({ message: 'Organization ID is required' })
  organizationId: string;

  @ApiPropertyOptional({
    description: 'Status to filter testimonials (e.g., approved, pending, rejected,published).',
    example: 'approved',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  status?: TestimonialStatus;

  @ApiPropertyOptional({
    description: 'Stars rating (1 to 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  startsRating?: number;

  @ApiPropertyOptional({
    description: 'Filter testimonials created from this date (ISO)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter testimonials created until this date (ISO)',
    example: '2025-01-31',
  })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiPropertyOptional({
    description: 'Filter testimonials that match any of the provided tags',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}