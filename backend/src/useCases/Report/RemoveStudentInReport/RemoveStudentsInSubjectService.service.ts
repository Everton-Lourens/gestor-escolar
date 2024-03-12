import { inject, injectable } from 'tsyringe'
import { IReportsRepository } from '../../../repositories/Reports/IReportsRepository'
import { AppError } from '../../../shared/errors/AppError'
import { IGradesRepository } from '../../../repositories/Grades/IGradesRepository'

interface IRequest {
  studentsIds: string[]
  idReport: string
}

@injectable()
export class RemoveStudentsInReportService {
  reportsRepository: IReportsRepository
  gradesRepository: IGradesRepository
  constructor(
    @inject('ReportsRepository') reportsRepository: IReportsRepository,
    @inject('GradesRepository') gradesRepository: IGradesRepository,
  ) {
    this.reportsRepository = reportsRepository
    this.gradesRepository = gradesRepository
  }

  async execute({ studentsIds, idReport }: IRequest): Promise<void> {
    if (!idReport) throw new AppError('_id da disciplina não foi informado')

    await this.reportsRepository.removeStudents(idReport, studentsIds)

    studentsIds.forEach(async (idStudent) => {
      const grade = await this.gradesRepository.listByReportAndStudent(
        idStudent,
        idReport,
      )
      await this.gradesRepository.delete(grade._id.toString())
    })
  }
}
