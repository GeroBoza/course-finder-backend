import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CourseCategory } from '../courses/course-category.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(
        () => CourseCategory,
        (courseCategory) => courseCategory.category,
    )
    courseCategories: CourseCategory[];
}
