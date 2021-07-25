import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../db/entities/company.entity';
import { Status } from '../shared/interfaces/status.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(data: CreateCompanyDto): Promise<Status> {
    let status: Status = {
      message: 'company created successfully',
      success: true,
    };
    const company: Company = new Company();
    company.name = data.name;
    company.address = data.address;
    company.accountStatus = data.accountStatus;
    company.paymentId = data.paymentId;
    company.phone = data.phone;
    company.planId = data.planId;

    try {
      await this.companyRepository.save(company);
    } catch (error) {
      status = {
        message: error,
        success: false,
      };
    }
    return status;
  }

  findOne(id: string): Promise<Company | undefined> {
    return this.companyRepository.findOneOrFail(id);
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Status> {
    let status: Status = {
      message: 'Updated correctly',
      success: true,
    };
    try {
      const companyFields = await this.companyRepository.findOneOrFail(id);
      await this.companyRepository.save({
        ...companyFields,
        ...updateCompanyDto,
      });
    } catch (error) {
      status = {
        message: error,
        success: false,
      };
    }
    return status;
  }

  async remove(id: string): Promise<Status> {
    let status: Status = {
      message: 'Company deleted correctly',
      success: true,
    };
    try {
      await this.companyRepository.delete(id);
    } catch (error) {
      status = {
        message: error,
        success: false,
      };
    }
    return status;
  }
}
