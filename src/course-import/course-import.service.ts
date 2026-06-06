import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/course.entity';
import { CourseCategory } from '../courses/course-category.entity';
import { Organization } from '../organizations/organization.entity';
import { Category } from '../categories/category.entity';
import { XlsxParserService } from './parsers/xlsx-parser.service';
import { DocxParserService } from './parsers/docx-parser.service';
import { IFileParser } from './parsers/file-parser.interface';
import { ImportResultDto } from './dto/import-result.dto';

@Injectable()
export class CourseImportService {
    private readonly parsers: IFileParser[];

    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
        @InjectRepository(CourseCategory)
        private readonly courseCategoryRepository: Repository<CourseCategory>,
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly xlsxParser: XlsxParserService,
        private readonly docxParser: DocxParserService,
    ) {
        // Register parsers here — add new ones as the feature grows
        this.parsers = [xlsxParser, docxParser];
    }

    async importFromFile(
        buffer: Buffer,
        mimetype: string,
        originalname: string,
        createdById: number,
    ): Promise<ImportResultDto> {
        const extension = originalname.includes('.')
            ? '.' + originalname.split('.').pop()?.toLowerCase()
            : '';

        const parser = this.parsers.find((p) => p.canHandle(mimetype, extension));

        if (!parser) {
            throw new BadRequestException(
                `Formato de archivo no soportado. Formatos aceptados: .xlsx`,
            );
        }

        const rows = await parser.parse(buffer);

        if (rows.length === 0) {
            throw new BadRequestException(
                'El archivo no contiene filas de datos. Verificá que tenga el formato correcto.',
            );
        }

        // Pre-load all organizations and categories to avoid N+1 queries
        const [allOrgs, allCats] = await Promise.all([
            this.organizationRepository.find(),
            this.categoryRepository.find(),
        ]);

        const orgMap = new Map(allOrgs.map((o) => [o.name.trim().toLowerCase(), o]));
        const catMap = new Map(allCats.map((c) => [c.name.trim().toLowerCase(), c]));

        const result: ImportResultDto = { importados: 0, omitidos: 0, errores: [] };

        for (let i = 0; i < rows.length; i++) {
            const rowNumber = i + 2; // +2 because row 1 is headers
            const row = rows[i];

            // ── Validate required fields ────────────────────────────────────
            if (!row.name?.trim()) {
                result.errores.push({ fila: rowNumber, motivo: 'El campo "Nombre" es obligatorio.' });
                continue;
            }

            if (!row.organization?.trim()) {
                result.errores.push({ fila: rowNumber, motivo: 'El campo "Organizacion" es obligatorio.' });
                continue;
            }

            if (!row.enrollmentUrl?.trim()) {
                result.errores.push({ fila: rowNumber, motivo: 'El campo "URL Inscripcion" es obligatorio.' });
                continue;
            }

            // ── Resolve organization ─────────────────────────────────────────
            const org = orgMap.get(row.organization.trim().toLowerCase());
            if (!org) {
                result.errores.push({
                    fila: rowNumber,
                    motivo: `Organización "${row.organization}" no encontrada en la base de datos.`,
                });
                continue;
            }

            // ── Duplicate check: same name + organizationId ──────────────────
            const existing = await this.courseRepository.findOne({
                where: {
                    name: row.name.trim(),
                    organizationId: org.id,
                },
            });

            if (existing) {
                result.omitidos++;
                continue;
            }

            // ── Parse optional fields ────────────────────────────────────────
            const startDate = this.parseDate(row.startDate);
            const endDate = this.parseDate(row.endDate);
            const isActive = row.active
                ? !['no', 'false', '0'].includes(row.active.toLowerCase())
                : true;

            // ── Resolve categories ───────────────────────────────────────────
            const resolvedCategoryIds: number[] = [];
            if (row.categories?.trim()) {
                const catNames = row.categories.split(',').map((c) => c.trim().toLowerCase());
                for (const catName of catNames) {
                    const cat = catMap.get(catName);
                    if (cat) resolvedCategoryIds.push(cat.id);
                }
            }

            // ── Create the course ────────────────────────────────────────────
            try {
                const course = this.courseRepository.create({
                    name: row.name.trim(),
                    description: row.description?.trim() || null,
                    organizationId: org.id,
                    enrollmentUrl: row.enrollmentUrl.trim(),
                    academicYear: row.academicYear?.trim() || null,
                    startDate: startDate ?? null,
                    endDate: endDate ?? null,
                    isActive,
                    createdById,
                });

                const saved = await this.courseRepository.save(course);

                if (resolvedCategoryIds.length > 0) {
                    const courseCategories = resolvedCategoryIds.map((categoryId) =>
                        this.courseCategoryRepository.create({ courseId: saved.id, categoryId }),
                    );
                    await this.courseCategoryRepository.save(courseCategories);
                }

                result.importados++;
            } catch {
                result.errores.push({
                    fila: rowNumber,
                    motivo: 'Error inesperado al guardar el curso.',
                });
            }
        }

        return result;
    }

    /** Parses DD/MM/YYYY or YYYY-MM-DD to a Date, returns null if invalid */
    private parseDate(value?: string): Date | null {
        if (!value?.trim()) return null;
        const v = value.trim();

        // DD/MM/YYYY
        const dmyMatch = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (dmyMatch) {
            return new Date(`${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`);
        }

        // YYYY-MM-DD
        const isoMatch = v.match(/^\d{4}-\d{2}-\d{2}$/);
        if (isoMatch) return new Date(v);

        return null;
    }
}
