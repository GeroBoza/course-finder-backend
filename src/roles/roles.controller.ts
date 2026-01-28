import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './role.entity';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get()
    @ApiOperation({ summary: 'Obtener todos los roles' })
    @ApiResponse({ status: 200, description: 'Lista de roles', type: [Role] })
    async findAll(): Promise<Role[]> {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un rol por ID' })
    @ApiResponse({ status: 200, description: 'Rol encontrado', type: Role })
    @ApiResponse({ status: 404, description: 'Rol no encontrado' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
        return this.rolesService.findOne(id);
    }
}
