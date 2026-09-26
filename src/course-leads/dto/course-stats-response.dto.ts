import { ApiProperty } from '@nestjs/swagger';
import { CourseLead } from '../course-lead.entity';

export class CourseStatsResponseDto {
    @ApiProperty({ example: 1 })
    courseId: number;

    @ApiProperty({ example: 'Actualización en Impuesto a las Ganancias' })
    courseName: string;

    @ApiProperty({ description: 'Visitas a la página del curso', example: 128 })
    viewCount: number;

    @ApiProperty({
        description: 'Personas que iniciaron la solicitud de inscripción',
        example: 14,
    })
    leadsCount: number;

    @ApiProperty({
        description: 'Solicitudes, de la más reciente a la más antigua',
        type: [CourseLead],
    })
    leads: CourseLead[];
}
