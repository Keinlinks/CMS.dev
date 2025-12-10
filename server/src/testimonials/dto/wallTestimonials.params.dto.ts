import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { QueryParamsDto } from "src/common/dto/queryParams.dto";

export class WallTestimonialsParamsDto extends QueryParamsDto {
  @ApiProperty({
    description: 'ID of the organization to get testimonials.',
    example: '61dd833b-54df-407e-b9e7-b8e1a5484c8d',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty({ message: 'Organization ID is required' })
  organizationId: string;
}