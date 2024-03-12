import { inject, injectable } from 'tsyringe'
import { IReportsRepository } from '../../../repositories/Reports/IReportsRepository'
import { AppError } from '../../../shared/errors/AppError'

@injectable()
export class DeleteReportService {
  reportsRepository: IReportsRepository
  constructor(
    @inject('ReportsRepository') reportsRepository: IReportsRepository,
  ) {
    this.reportsRepository = reportsRepository
  }

  async execute(idReport: string): Promise<void> {
    if (!idReport) throw new AppError('_id da disciplina não foi informado')

    const report = await this.reportsRepository.findById(idReport)

    if (!report) throw new AppError('Disciplina não encontrada')

    await this.reportsRepository.delete(report._id.toString())
  }
}
