import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../courses/course.entity';
import { CourseCategory } from '../courses/course-category.entity';
import { Organization } from '../organizations/organization.entity';
import { Category } from '../categories/category.entity';
import { CourseImportController } from './course-import.controller';
import { CourseImportService } from './course-import.service';
import { XlsxParserService } from './parsers/xlsx-parser.service';
import { DocxParserService } from './parsers/docx-parser.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Course, CourseCategory, Organization, Category]),
    ],
    controllers: [CourseImportController],
    providers: [
        CourseImportService,
        XlsxParserService,
        DocxParserService,
    ],
})
export class CourseImportModule {}
