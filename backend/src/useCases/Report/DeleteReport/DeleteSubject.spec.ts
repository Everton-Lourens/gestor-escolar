import { Types } from 'mongoose'
import { MockReportsRepository } from '../../../repositories/Reports/MockReportsRepository'
import { CreateNewReportService } from '../CreateNewReport/CreateNewReportService.service'
import { DeleteReportService } from './DeleteReportService.service'
import { AppError } from '../../../shared/errors/AppError'

let mockReportsRepository: MockReportsRepository

let createNewSubjcetService: CreateNewReportService
let deleteReportService: DeleteReportService

describe('Delete a report', () => {
  beforeEach(() => {
    mockReportsRepository = new MockReportsRepository()

    createNewSubjcetService = new CreateNewReportService(
      mockReportsRepository,
    )
    deleteReportService = new DeleteReportService(mockReportsRepository)
  })

  it('should be able delete a report', async () => {
    const newReport = await createNewSubjcetService.execute({
      name: 'Teste report',
      idTeacher: new Types.ObjectId().toString(),
    })

    await deleteReportService.execute(newReport._id.toString())

    const notFoundReport = await mockReportsRepository.findById(
      newReport._id.toString(),
    )

    expect(notFoundReport).toBeUndefined()
  })

  it('should not be able delete a report if idReport is from a invalid report', async () => {
    await expect(async () => {
      await deleteReportService.execute(new Types.ObjectId().toString())
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able delete a report if idReport not sent', async () => {
    await expect(async () => {
      await deleteReportService.execute(undefined)
    }).rejects.toBeInstanceOf(AppError)
  })
})
