import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseLead } from './course-lead.entity';
import { CreateCourseLeadDto } from './dto/create-course-lead.dto';
import { CourseStatsResponseDto } from './dto/course-stats-response.dto';
import { Course } from '../courses/course.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CourseLeadsService {
    private readonly logger = new Logger(CourseLeadsService.name);

    constructor(
        @InjectRepository(CourseLead)
        private readonly courseLeadRepository: Repository<CourseLead>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
        private readonly mailService: MailService,
    ) {}

    async create(
        createCourseLeadDto: CreateCourseLeadDto,
        ipAddress: string,
        userAgent: string,
    ): Promise<CourseLead> {
        // Verificar que el curso existe
        const course = await this.courseRepository.findOne({
            where: { id: createCourseLeadDto.courseId },
            relations: ['organization'],
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

        const savedLead = await this.courseLeadRepository.save(courseLead);

        try {
            await this.mailService.sendLeadEmails({
                fullName: savedLead.fullName,
                email: savedLead.email,
                phone: savedLead.phone,
                courseName: course.name,
                organizationName: course.organization?.name,
                enrollmentUrl: course.enrollmentUrl,
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(
                `No se pudieron enviar los mails del lead ${savedLead.id}: ${message}`,
            );
        }

        return savedLead;
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
