import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsNumber,
    IsOptional,
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

    @ApiProperty({
        description: 'ID del usuario (opcional si está autenticado)',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    userId?: number;
}
