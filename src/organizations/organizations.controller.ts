import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) {}

    @Get()
    @ApiOperation({ summary: 'Obtener todas las organizaciones' })
    @ApiResponse({
        status: 200,
        description: 'Lista de organizaciones',
        type: [Organization],
    })
    async findAll(): Promise<Organization[]> {
        return this.organizationsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una organización por ID' })
    @ApiResponse({
        status: 200,
        description: 'Organización encontrada',
        type: Organization,
    })
    @ApiResponse({ status: 404, description: 'Organización no encontrada' })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Organization> {
        return this.organizationsService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear una organización (Solo Admin)' })
    @ApiResponse({
        status: 201,
        description: 'Organización creada exitosamente',
        type: Organization,
    })
    @ApiResponse({ status: 403, description: 'No autorizado' })
    async create(
        @Body() createOrganizationDto: CreateOrganizationDto,
    ): Promise<Organization> {
        return this.organizationsService.create(createOrganizationDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar una organización (Solo Admin)' })
    @ApiResponse({
        status: 200,
        description: 'Organización actualizada exitosamente',
        type: Organization,
    })
    @ApiResponse({ status: 403, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Organización no encontrada' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateOrganizationDto: UpdateOrganizationDto,
    ): Promise<Organization> {
        return this.organizationsService.update(id, updateOrganizationDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una organización (Solo Admin)' })
    @ApiResponse({
        status: 204,
        description: 'Organización eliminada exitosamente',
    })
    @ApiResponse({ status: 403, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Organización no encontrada' })
    @ApiResponse({
        status: 409,
        description: 'La organización tiene cursos asociados',
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.organizationsService.remove(id);
    }
}
