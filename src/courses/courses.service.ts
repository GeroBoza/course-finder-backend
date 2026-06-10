import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
import { CourseCategory } from './course-category.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
        @InjectRepository(CourseCategory)
        private readonly courseCategoryRepository: Repository<CourseCategory>,
    ) {}

    async findAll(filters: FilterCourseDto) {
        const {
            categoryId,
            organizationId,
            academicYear,
            page = 1,
            limit = 10,
            includeInactive = false,
        } = filters;
        const skip = (page - 1) * limit;

        const queryBuilder = this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.organization', 'organization')
            .leftJoinAndSelect('course.createdBy', 'createdBy')
            .leftJoinAndSelect('course.images', 'images')
            .leftJoinAndSelect('course.courseCategories', 'courseCategories')
            .leftJoinAndSelect('courseCategories.category', 'category');

        if (!includeInactive) {
            queryBuilder.where('course.isActive = :isActive', {
                isActive: true,
            });
        }

        if (categoryId) {
            queryBuilder.andWhere('category.id = :categoryId', { categoryId });
        }

        if (organizationId) {
            queryBuilder.andWhere('course.organizationId = :organizationId', {
                organizationId,
            });
        }

        if (academicYear) {
            queryBuilder.andWhere('course.academicYear = :academicYear', {
                academicYear,
            });
        }

        queryBuilder.orderBy('course.createdAt', 'DESC').skip(skip).take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: number): Promise<Course> {
        const course = await this.courseRepository.findOne({
            where: { id },
            relations: [
                'organization',
                'createdBy',
                'images',
                'courseCategories',
                'courseCategories.category',
            ],
        });

        if (!course) {
            throw new NotFoundException(`Curso con ID ${id} no encontrado`);
        }

        return course;
    }

    async create(
        createCourseDto: CreateCourseDto,
        createdById: number,
    ): Promise<Course> {
        const course = this.courseRepository.create({
            ...createCourseDto,
            createdById,
            startDate: createCourseDto.startDate
                ? new Date(createCourseDto.startDate)
                : null,
            endDate: createCourseDto.endDate
                ? new Date(createCourseDto.endDate)
                : null,
        });

        const savedCourse = await this.courseRepository.save(course);

        // Asociar categorías si se proporcionan
        if (
            createCourseDto.categoryIds &&
            createCourseDto.categoryIds.length > 0
        ) {
            const courseCategories = createCourseDto.categoryIds.map(
                (categoryId) =>
                    this.courseCategoryRepository.create({
                        courseId: savedCourse.id,
                        categoryId,
                    }),
            );
            await this.courseCategoryRepository.save(courseCategories);
        }

        return this.findOne(savedCourse.id);
    }

    async update(
        id: number,
        updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        const course = await this.findOne(id);

        const updateData: any = { ...updateCourseDto };

        if (updateCourseDto.startDate) {
            updateData.startDate = new Date(updateCourseDto.startDate);
        }
        if (updateCourseDto.endDate) {
            updateData.endDate = new Date(updateCourseDto.endDate);
        }

        // Eliminar categoryIds del objeto de actualización ya que se maneja por separado
        delete updateData.categoryIds;

        Object.assign(course, updateData);

        await this.courseRepository.save(course);

        // Actualizar categorías si se proporcionan
        if (updateCourseDto.categoryIds !== undefined) {
            // Eliminar categorías existentes
            await this.courseCategoryRepository.delete({ courseId: id });

            // Agregar nuevas categorías
            if (updateCourseDto.categoryIds.length > 0) {
                const courseCategories = updateCourseDto.categoryIds.map(
                    (categoryId) =>
                        this.courseCategoryRepository.create({
                            courseId: id,
                            categoryId,
                        }),
                );
                await this.courseCategoryRepository.save(courseCategories);
            }
        }

        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const course = await this.findOne(id);
        course.isActive = false;
        await this.courseRepository.save(course);
    }

    async incrementViewCount(id: number): Promise<{ viewCount: number }> {
        const result = await this.courseRepository
            .createQueryBuilder()
            .update(Course)
            .set({ viewCount: () => 'view_count + 1' })
            .where('id = :id', { id })
            .execute();

        if (!result.affected) {
            throw new NotFoundException(`Curso con ID ${id} no encontrado`);
        }

        const course = await this.courseRepository.findOne({
            where: { id },
            select: ['id', 'viewCount'],
        });

        return { viewCount: course.viewCount };
    }
}
