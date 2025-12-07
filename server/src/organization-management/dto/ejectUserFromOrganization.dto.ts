import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class EjectUserFromOrganizationDto {
    @ApiProperty({
        description: 'Unique identifier of the user to be ejected from the organization. Must exist in the system.',
        example: 'a12bc34d-5e6f-7g8h-9i01-jk2lmno3p4qr'
    })
    @IsString()
    @IsNotEmpty()
    ejectUserId: string;

    @ApiProperty({
        description: 'Unique identifier of the organization the user is being invited to. Must exist in the system.',
        example: 'b72ce18d-1c62-4df7-9c55-43c29b5dc1f4'
    })
    @IsString()
    @IsNotEmpty()
    organizationId: string;
}