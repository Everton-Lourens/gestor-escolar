import { Types } from 'mongoose'
import { MockReportsRepository } from '../../../repositories/Reports/MockSubjectsRepository'
import { CreateNewReportService } from './CreateNewReportService.service'
import { AppError } from '../../../shared/errors/AppError'

let mockReportsRepository: MockReportsRepository

let createNewSubjcetService: CreateNewReportService

describe('Create new report', () => {
  beforeEach(() => {
    mockReportsRepository = new MockReportsRepository()

    createNewSubjcetService = new CreateNewReportService(
      mockReportsRepository,
    )
  })

  it('should be able create a new report', async () => {
    const newReport = await createNewSubjcetService.execute({
      name: 'Teste report',
      idTeacher: new Types.ObjectId().toString(),
    })

    const createdReport = mockReportsRepository.findById(
      newReport._id.toString(),
    )

    expect(createdReport).toBeDefined()
  })

  it('should not be able create a new report if name not sent', async () => {
    await expect(async () => {
      await createNewSubjcetService.execute({
        name: undefined,
        idTeacher: new Types.ObjectId().toString(),
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able create a new report if idTeacher not sent', async () => {
    await expect(async () => {
      await createNewSubjcetService.execute({
        name: 'Nome de teste',
        idTeacher: undefined,
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
