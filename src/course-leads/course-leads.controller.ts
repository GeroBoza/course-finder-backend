import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    ParseIntPipe,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CourseLeadsService } from './course-leads.service';
import { CreateCourseLeadDto } from './dto/create-course-lead.dto';
import { CourseLead } from './course-lead.entity';
import { Request } from 'express';

@ApiTags('course-leads')
@Controller('course-leads')
export class CourseLeadsController {
    constructor(private readonly courseLeadsService: CourseLeadsService) {}

    @Post()
    @ApiOperation({
        summary: 'Registrar un nuevo lead de curso (permite usuarios anónimos)',
    })
    @ApiResponse({
        status: 201,
        description: 'Lead registrado exitosamente',
        type: CourseLead,
    })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    async create(
        @Body() createCourseLeadDto: CreateCourseLeadDto,
        @Req() req: Request,
    ): Promise<CourseLead> {
        const ipAddress = req.ip || req.connection.remoteAddress || '';
        const userAgent = req.get('user-agent') || '';

        return this.courseLeadsService.create(
            createCourseLeadDto,
            ipAddress,
            userAgent,
        );
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los leads' })
    @ApiResponse({
        status: 200,
        description: 'Lista de leads',
        type: [CourseLead],
    })
    async findAll(): Promise<CourseLead[]> {
        return this.courseLeadsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un lead por ID' })
    @ApiResponse({
        status: 200,
        description: 'Lead encontrado',
        type: CourseLead,
    })
    @ApiResponse({ status: 404, description: 'Lead no encontrado' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CourseLead> {
        return this.courseLeadsService.findOne(id);
    }
}
