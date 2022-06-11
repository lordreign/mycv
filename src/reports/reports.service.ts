import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimatetDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  // query builder 사용
  async createEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimatetDto) {
    // .select('*')
    return this.repo
      .createQueryBuilder('report')
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .leftJoinAndSelect('report.user', 'user')
      .setParameters({ mileage })
      .limit(3)
      .getRawMany();
  }

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = Promise.resolve(user);
    // report.user = Promise.resolve([user]); // 만약 여러개일 경우
    return await this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne(id);
    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return await this.repo.save(report);
  }

  async findOne(id: string) {
    return await this.repo.findOne(id);
  }
}
