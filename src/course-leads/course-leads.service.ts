import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseLead } from './course-lead.entity';
import { CreateCourseLeadDto } from './dto/create-course-lead.dto';
import { CourseStatsResponseDto } from './dto/course-stats-response.dto';
import { Course } from '../courses/course.entity';

@Injectable()
export class CourseLeadsService {
    constructor(
        @InjectRepository(CourseLead)
        private readonly courseLeadRepository: Repository<CourseLead>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async create(
        createCourseLeadDto: CreateCourseLeadDto,
        ipAddress: string,
        userAgent: string,
    ): Promise<CourseLead> {
        // Verificar que el curso existe
        const course = await this.courseRepository.findOne({
            where: { id: createCourseLeadDto.courseId },
        });

        if (!course) {
            throw new NotFoundException(
                `Curso con ID ${createCourseLeadDto.courseId} no encontrado`,
            );
        }

        // Un mismo email no genera más de un lead por curso: con el primer
        // registro ya sabemos que la persona mostró interés
        const existingLead = await this.courseLeadRepository.findOne({
            where: {
                courseId: createCourseLeadDto.courseId,
                email: createCourseLeadDto.email,
            },
        });

        if (existingLead) {
            return existingLead;
        }

        const courseLead = this.courseLeadRepository.create({
            ...createCourseLeadDto,
            ipAddress,
            userAgent,
        });

        return this.courseLeadRepository.save(courseLead);
    }

    async findAll(): Promise<CourseLead[]> {
        return this.courseLeadRepository.find({
            relations: ['course', 'user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findStatsByCourse(courseId: number): Promise<CourseStatsResponseDto> {
        const course = await this.courseRepository.findOne({
            where: { id: courseId },
        });

        if (!course) {
            throw new NotFoundException(
                `Curso con ID ${courseId} no encontrado`,
            );
        }

        const leads = await this.courseLeadRepository.find({
            where: { courseId },
            order: { createdAt: 'DESC' },
        });

        return {
            courseId: course.id,
            courseName: course.name,
            viewCount: course.viewCount,
            leadsCount: leads.length,
            leads,
        };
    }

    async findOne(id: number): Promise<CourseLead> {
        const lead = await this.courseLeadRepository.findOne({
            where: { id },
            relations: ['course', 'user'],
        });

        if (!lead) {
            throw new NotFoundException(`Lead con ID ${id} no encontrado`);
        }

        return lead;
    }
}
