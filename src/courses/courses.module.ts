import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './course.entity';
import { CourseImage } from './course-image.entity';
import { CourseCategory } from './course-category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course, CourseImage, CourseCategory])],
    controllers: [CoursesController],
    providers: [CoursesService],
    exports: [CoursesService],
})
export class CoursesModule {}
