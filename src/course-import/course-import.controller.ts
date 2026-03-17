import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CourseImportService } from './course-import.service';
import { ImportResultDto } from './dto/import-result.dto';

const ACCEPTED_MIMETYPES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel',                                           // .xls
    // Future: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' (.docx)
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

@ApiTags('course-import')
@Controller('courses/import')
export class CourseImportController {
    constructor(private readonly courseImportService: CourseImportService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: MAX_FILE_SIZE_BYTES },
            fileFilter: (_req, file, cb) => {
                const ext = file.originalname.split('.').pop()?.toLowerCase();
                if (ACCEPTED_MIMETYPES.includes(file.mimetype) || ext === 'xlsx') {
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
    @ApiOperation({ summary: 'Importar cursos desde un archivo .xlsx' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Resultado del proceso de importación' })
    @ApiResponse({ status: 400, description: 'Archivo inválido o formato no soportado' })
    async importCourses(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<ImportResultDto> {
        if (!file) {
            throw new BadRequestException('No se recibió ningún archivo.');
        }

        // Hardcoded superadmin ID = 1 (same convention used in CoursesController)
        const ADMIN_USER_ID = 1;

        return this.courseImportService.importFromFile(
            file.buffer,
            file.mimetype,
            file.originalname,
            ADMIN_USER_ID,
        );
    }
}
