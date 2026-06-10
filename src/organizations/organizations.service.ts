import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { Course } from '../courses/course.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async findAll(): Promise<Organization[]> {
        return this.organizationRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Organization> {
        const organization = await this.organizationRepository.findOne({
            where: { id },
            relations: ['courses'],
        });

        if (!organization) {
            throw new NotFoundException(
                `Organización con ID ${id} no encontrada`,
            );
        }

        return organization;
    }

    async create(
        createOrganizationDto: CreateOrganizationDto,
    ): Promise<Organization> {
        const organization = this.organizationRepository.create(
            createOrganizationDto,
        );
        return this.organizationRepository.save(organization);
    }

    async update(
        id: number,
        updateOrganizationDto: UpdateOrganizationDto,
    ): Promise<Organization> {
        const organization = await this.findOne(id);
        Object.assign(organization, updateOrganizationDto);
        return this.organizationRepository.save(organization);
    }

    async remove(id: number): Promise<void> {
        const organization = await this.findOne(id);

        const courseCount = await this.courseRepository.count({
            where: { organizationId: id },
        });

        if (courseCount > 0) {
            throw new ConflictException(
                `No se puede eliminar "${organization.name}" porque tiene ${courseCount} curso(s) asociado(s)`,
            );
        }

        await this.organizationRepository.remove(organization);
    }
}
