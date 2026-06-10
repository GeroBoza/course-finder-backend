import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FilterCourseDto {
    @ApiProperty({
        description: 'ID de categoría para filtrar',
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    categoryId?: number;

    @ApiProperty({
        description: 'ID de organización para filtrar',
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    organizationId?: number;

    @ApiProperty({ description: 'Año académico para filtrar', required: false })
    @IsOptional()
    @IsString()
    academicYear?: string;

    @ApiProperty({ description: 'Página', default: 1, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        description: 'Límite de resultados por página',
        default: 10,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @ApiProperty({
        description:
            'Incluir cursos inactivos (útil para el panel de administración)',
        default: false,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    includeInactive?: boolean = false;
}
