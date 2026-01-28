import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Course } from '../courses/course.entity';

@Entity('organizations')
export class Organization {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'varchar',
        length: 500,
        nullable: true,
        name: 'website_url',
    })
    websiteUrl: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'contact_email',
    })
    contactEmail: string;

    @Column({ type: 'varchar', length: 500, nullable: true, name: 'logo_url' })
    logoUrl: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Course, (course) => course.organization)
    courses: Course[];
}
