import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
import { ViewCountResponseDto } from './dto/view-count-response.dto';
import { Course } from './course.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Get()
    @ApiOperation({ summary: 'Obtener todos los cursos con filtros' })
    @ApiResponse({ status: 200, description: 'Lista de cursos paginada' })
    async findAll(@Query() filters: FilterCourseDto) {
        return this.coursesService.findAll(filters);
    }

    @Post(':id/view')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Registrar una visualización del curso' })
    @ApiResponse({
        status: 200,
        description: 'Contador actualizado',
        type: ViewCountResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    async registerView(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ViewCountResponseDto> {
        return this.coursesService.incrementViewCount(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un curso por ID' })
    @ApiResponse({ status: 200, description: 'Curso encontrado', type: Course })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Course> {
        return this.coursesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo curso (Solo Admin)' })
    @ApiResponse({
        status: 201,
        description: 'Curso creado exitosamente',
        type: Course,
    })
    @ApiResponse({ status: 403, description: 'No autorizado' })
    async create(
        @Body() createCourseDto: CreateCourseDto,
        @CurrentUser() user: User,
    ): Promise<Course> {
        return this.coursesService.create(createCourseDto, user.id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar un curso (Solo Admin)' })
    @ApiResponse({
        status: 200,
        description: 'Curso actualizado exitosamente',
        type: Course,
    })
    @ApiResponse({ status: 403, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Eliminar un curso (soft delete) (Solo Admin)',
    })
    @ApiResponse({ status: 204, description: 'Curso eliminado exitosamente' })
    @ApiResponse({ status: 403, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.coursesService.remove(id);
    }
}
