import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateOrganizationDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false })
    @IsUrl()
    @IsOptional()
    websiteUrl?: string;

    @ApiProperty({ required: false })
    @IsEmail()
    @IsOptional()
    contactEmail?: string;

    @ApiProperty({ required: false })
    @IsUrl()
    @IsOptional()
    logoUrl?: string;
}
