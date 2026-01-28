import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CourseLead } from '../course-leads/course-lead.entity';
import { Organization } from '../organizations/organization.entity';
import { User } from '../users/user.entity';
import { CourseCategory } from './course-category.entity';
import { CourseImage } from './course-image.entity';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Organization, (organization) => organization.courses)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @Column({ name: 'organization_id' })
    organizationId: number;

    @ManyToOne(() => User, (user) => user.courses)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;

    @Column({ name: 'created_by' })
    createdById: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: true,
        name: 'academic_year',
    })
    academicYear: string;

    @Column({
        type: 'varchar',
        length: 500,
        name: 'enrollment_url',
    })
    enrollmentUrl: string;

    @Column({ type: 'date', nullable: true, name: 'start_date' })
    startDate: Date;

    @Column({ type: 'date', nullable: true, name: 'end_date' })
    endDate: Date;

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => CourseImage, (image) => image.course)
    images: CourseImage[];

    @OneToMany(() => CourseCategory, (courseCategory) => courseCategory.course)
    courseCategories: CourseCategory[];

    @OneToMany(() => CourseLead, (lead) => lead.course)
    leads: CourseLead[];
}
