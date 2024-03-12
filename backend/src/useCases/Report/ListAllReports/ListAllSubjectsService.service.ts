import { inject, injectable } from 'tsyringe'
import { IReportsRepository } from '../../../repositories/Reports/IReportsRepository'
import { IReport } from '../../../entities/report'
import { AppError } from '../../../shared/errors/AppError'

interface IRequest {
  idTeacher: string
}

@injectable()
export class ListAllReportsService {
  reportsRepository: IReportsRepository
  constructor(
    @inject('ReportsRepository') reportsRepository: IReportsRepository,
  ) {
    this.reportsRepository = reportsRepository
  }

  async execute({ idTeacher }: IRequest): Promise<IReport[]> {
    if (!idTeacher) throw new AppError('_id do professor não foi informado.')

    return await this.reportsRepository.list(idTeacher)
  }
}
