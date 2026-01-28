import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';

@Entity('course_images')
export class CourseImage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Course, (course) => course.images)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @Column({ name: 'course_id' })
    courseId: number;

    @Column({ type: 'varchar', length: 500, name: 'image_url' })
    imageUrl: string;

    @Column({ type: 'boolean', default: false, name: 'is_main' })
    isMain: boolean;
}
