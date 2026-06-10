import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateOrganizationDto {
    @ApiProperty({ example: 'Universidad Nacional de Buenos Aires' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false, example: 'https://www.uba.ar' })
    @IsUrl()
    @IsOptional()
    websiteUrl?: string;

    @ApiProperty({ required: false, example: 'contacto@uba.ar' })
    @IsEmail()
    @IsOptional()
    contactEmail?: string;

    @ApiProperty({ required: false, example: 'https://www.uba.ar/logo.png' })
    @IsUrl()
    @IsOptional()
    logoUrl?: string;
}
