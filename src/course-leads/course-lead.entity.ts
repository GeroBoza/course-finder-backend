import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';

@Entity('course_leads')
export class CourseLead {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Course, (course) => course.leads)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @Column({ name: 'course_id' })
    courseId: number;

    @ManyToOne(() => User, (user) => user.courseLeads, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', nullable: true })
    userId: number;

    @Column({ type: 'varchar', length: 255, name: 'full_name' })
    fullName: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 45, nullable: true, name: 'ip_address' })
    ipAddress: string;

    @Column({ type: 'text', nullable: true, name: 'user_agent' })
    userAgent: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
