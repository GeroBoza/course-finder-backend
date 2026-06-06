import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiConsumes,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { CourseImportService } from './course-import.service';
import { ImportResultDto } from './dto/import-result.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

const ACCEPTED_MIMETYPES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@ApiTags('course-import')
@Controller('courses/import')
export class CourseImportController {
    constructor(private readonly courseImportService: CourseImportService) {}

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: MAX_FILE_SIZE_BYTES },
            fileFilter: (_req, file, cb) => {
                const ext = file.originalname.split('.').pop()?.toLowerCase();
                if (
                    ACCEPTED_MIMETYPES.includes(file.mimetype) ||
                    ext === 'xlsx'
                ) {
                    cb(null, true);
                } else {
                    cb(
                        new BadRequestException(
                            'Formato no aceptado. Solo se permiten archivos .xlsx por el momento.',
                        ),
                        false,
                    );
                }
            },
        }),
    )
    @ApiOperation({ summary: 'Importar cursos desde un archivo .xlsx (Solo Admin)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Resultado del proceso de importación',
    })
    @ApiResponse({
        status: 400,
        description: 'Archivo inválido o formato no soportado',
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'No autorizado' })
    async importCourses(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: User,
    ): Promise<ImportResultDto> {
        if (!file) {
            throw new BadRequestException('No se recibió ningún archivo.');
        }

        return this.courseImportService.importFromFile(
            file.buffer,
            file.mimetype,
            file.originalname,
            user.id,
        );
    }
}
