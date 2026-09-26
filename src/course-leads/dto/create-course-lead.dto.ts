import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsNumber,
    MaxLength,
} from 'class-validator';

export class CreateCourseLeadDto {
    @ApiProperty({ description: 'ID del curso', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    courseId: number;

    @ApiProperty({ description: 'Nombre completo', example: 'Juan Pérez' })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ description: 'Email', example: 'juan@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Teléfono', example: '+54 9 11 1234-5678' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    phone: string;
}
