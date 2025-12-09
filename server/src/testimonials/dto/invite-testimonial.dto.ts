import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsString } from "class-validator";

export class InviteTestimonialDto {
  @ApiProperty({
    type: [String],
    example: ['customer1@mail.com', 'customer2@mail.com'],
    description: 'List of email addresses to send the testimonial invitation to.',
  })
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];

  @ApiProperty({
    type: [String],
    description: 'Category ID associated with testimonials.',
  })
  @IsString()
  categoryId: string;

  @ApiProperty({
    example: 'c2ca55c2-d033-4320-a7b4-fb096b0db9e2',
    description: 'Organization ID that is sending the testimonial request.',
  })
  @IsString()
  organizationId: string;
}