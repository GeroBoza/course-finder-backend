import {
    Body,
    Controller,
    Delete,
    Get,
    Put,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { SettingsService } from './settings.service';
import { UpdateChatgptImportPromptDto } from './dto/update-chatgpt-import-prompt.dto';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get('chatgpt-import-prompt')
    @ApiOperation({ summary: 'Obtener el prompt de importación de cursos' })
    @ApiResponse({ status: 200, description: 'Prompt actual o default' })
    getChatgptImportPrompt() {
        return this.settingsService.getChatgptImportPrompt();
    }

    @Put('chatgpt-import-prompt')
    @ApiOperation({ summary: 'Actualizar el prompt de importación de cursos' })
    @ApiResponse({ status: 200, description: 'Prompt actualizado' })
    updateChatgptImportPrompt(@Body() dto: UpdateChatgptImportPromptDto) {
        return this.settingsService.updateChatgptImportPrompt(dto.prompt);
    }

    @Delete('chatgpt-import-prompt')
    @ApiOperation({
        summary: 'Restaurar el prompt de importación al valor por defecto',
    })
    @ApiResponse({ status: 200, description: 'Prompt restaurado' })
    resetChatgptImportPrompt() {
        return this.settingsService.resetChatgptImportPrompt();
    }
}
