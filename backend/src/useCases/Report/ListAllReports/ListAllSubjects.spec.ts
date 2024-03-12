import { Types } from 'mongoose'
import { MockReportsRepository } from '../../../repositories/Reports/MockReportsRepository'
import { CreateNewReportService } from '../CreateNewReport/CreateNewReportService.service'
import { ListAllReportsService } from './ListAllReportsService.service'
import { AppError } from '../../../shared/errors/AppError'

let mockReportsRepository: MockReportsRepository

let createNewReportService: CreateNewReportService
let listAllReportsService: ListAllReportsService

describe('List all reports', () => {
  beforeEach(() => {
    mockReportsRepository = new MockReportsRepository()

    createNewReportService = new CreateNewReportService(
      mockReportsRepository,
    )
    listAllReportsService = new ListAllReportsService(mockReportsRepository)
  })

  it('should be able list all reports', async () => {
    const idTeacher = new Types.ObjectId().toString()

    const report = await createNewReportService.execute({
      name: 'Teste report',
      idTeacher,
    })

    const reports = await listAllReportsService.execute({
      idTeacher,
    })

    expect(reports).toContainEqual(
      expect.objectContaining({ _id: report._id }),
    )
  })

  it('should not be able list reports if idTeacher not sent', async () => {
    await expect(async () => {
      const idTeacher = new Types.ObjectId().toString()

      await createNewReportService.execute({
        name: 'Teste report',
        idTeacher,
      })

      await listAllReportsService.execute({ idTeacher: undefined })
    }).rejects.toBeInstanceOf(AppError)
  })
})
