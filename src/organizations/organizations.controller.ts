import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { Organization } from './organization.entity';

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
}
