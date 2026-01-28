import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
    ) {}

    async findAll(): Promise<Organization[]> {
        return this.organizationRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Organization> {
        return this.organizationRepository.findOne({
            where: { id },
            relations: ['courses'],
        });
    }
}
