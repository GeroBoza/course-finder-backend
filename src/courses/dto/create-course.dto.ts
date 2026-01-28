import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDateString,
    IsBoolean,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourseDto {
    @ApiProperty({ description: 'ID de la organización', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    organizationId: number;

    @ApiProperty({
        description: 'Nombre del curso',
        example: 'Curso de TypeScript',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Descripción del curso', example: 'Curso completo de TypeScript' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Año académico',
        example: '2024-2025',
        required: false,
    })
    @IsString()
    @IsOptional()
    academicYear?: string;

    @ApiProperty({ description: 'URL de inscripción', example: 'https://example.com/enroll' })
    @IsString()
    @IsNotEmpty()
    enrollmentUrl: string;

    @ApiProperty({
        description: 'Fecha de inicio',
        example: '2024-01-15',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiProperty({
        description: 'Fecha de fin',
        example: '2024-06-15',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiProperty({
        description: 'Estado activo',
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({
        description: 'IDs de categorías',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    categoryIds?: number[];
}
