import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @ApiOperation({ summary: 'Obtener todas las categorías' })
    @ApiResponse({
        status: 200,
        description: 'Lista de categorías',
        type: [Category],
    })
    async findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }
}
