import { inject, injectable } from 'tsyringe'
import { Types } from 'mongoose'

import { User } from '../../../entities/user'
import { AppError } from '../../../shared/errors/AppError'
import { IReportsRepository } from '../../../repositories/Reports/IReportsRepository'

@injectable()
export class ListStudentsByReportService {
  reportsRepository: IReportsRepository
  constructor(
    @inject('ReportsRepository') reportsRepository: IReportsRepository,
  ) {
    this.reportsRepository = reportsRepository
  }

  async execute(idReport: string): Promise<User[] | Types.ObjectId[]> {
    if (!idReport) throw new AppError('_id da disciplina não enviado')

    const report = await this.reportsRepository.findById(idReport)

    return report.students
  }
}
