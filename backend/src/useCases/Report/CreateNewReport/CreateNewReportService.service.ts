import { inject, injectable } from 'tsyringe'
import { IReportsRepository } from '../../../repositories/Reports/IReportsRepository'
import { IReport } from '../../../entities/report'
import { AppError } from '../../../shared/errors/AppError'

interface IRequest {
  name: string
  idTeacher: string
}

@injectable()
export class CreateNewReportService {
  reportsRepository: IReportsRepository
  constructor(
    @inject('ReportsRepository') reportsRepository: IReportsRepository,
  ) {
    this.reportsRepository = reportsRepository
  }

  async execute({ name, idTeacher }: IRequest): Promise<IReport> {
    if (!name) throw new AppError('O nome da disciplina não foi informado.')
    if (!idTeacher) throw new AppError('_id do professor não foi informado')

    const entries = await this.reportsRepository.getEntries({ idTeacher })
    const code: string = (entries + 1).toString()

    const newReport = await this.reportsRepository.create({
      code,
      name,
      idTeacher,
    })
    return newReport
  }
}
