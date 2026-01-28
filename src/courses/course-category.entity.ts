import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Course } from './course.entity';

@Entity('courses_categories')
export class CourseCategory {
    @PrimaryColumn({ name: 'course_id' })
    courseId: number;

    @PrimaryColumn({ name: 'category_id' })
    categoryId: number;

    @ManyToOne(() => Course, (course) => course.courseCategories)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => Category, (category) => category.courseCategories)
    @JoinColumn({ name: 'category_id' })
    category: Category;
}
