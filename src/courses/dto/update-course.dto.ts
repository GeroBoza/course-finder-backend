import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsOptional,
    IsDateString,
    IsBoolean,
    IsArray,
} from 'class-validator';

export class UpdateCourseDto {
    @ApiProperty({ description: 'ID de la organización', required: false })
    @IsNumber()
    @IsOptional()
    organizationId?: number;

    @ApiProperty({ description: 'Nombre del curso', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Descripción del curso', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Año académico', required: false })
    @IsString()
    @IsOptional()
    academicYear?: string;

    @ApiProperty({ description: 'URL de inscripción', required: false })
    @IsString()
    @IsOptional()
    enrollmentUrl?: string;

    @ApiProperty({ description: 'Fecha de inicio', required: false })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiProperty({ description: 'Fecha de fin', required: false })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiProperty({ description: 'Estado activo', required: false })
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
