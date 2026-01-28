import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseLeadsController } from './course-leads.controller';
import { CourseLeadsService } from './course-leads.service';
import { CourseLead } from './course-lead.entity';
import { Course } from '../courses/course.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CourseLead, Course])],
    controllers: [CourseLeadsController],
    providers: [CourseLeadsService],
    exports: [CourseLeadsService],
})
export class CourseLeadsModule {}
