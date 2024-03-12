import { Types } from 'mongoose'
import { MockStudentsRepository } from '../../../repositories/Students/MockStudentsRepository'
import { MockUsersRepository } from '../../../repositories/Users/MockUsersRepository'
import { CreateNewStudentService } from '../../Student/CreateNewStudent/CreateNewStudentService.service'
import { InsertStudentInReportService } from './InsertStudentInReportService.service'
import { MockReportsRepository } from '../../../repositories/Reports/MockReportsRepository'
import { CreateNewReportService } from '../CreateNewReport/CreateNewReportService.service'
import { AppError } from '../../../shared/errors/AppError'

let mockUsersRepository: MockUsersRepository
let mockStudentsRepository: MockStudentsRepository
let mockReportsRepository: MockReportsRepository

let createNewStudentService: CreateNewStudentService
let insertStudentInReportService: InsertStudentInReportService
let createNewReportService: CreateNewReportService

describe('Insert student in report', () => {
  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository()
    mockStudentsRepository = new MockStudentsRepository(mockUsersRepository)
    mockReportsRepository = new MockReportsRepository()

    createNewStudentService = new CreateNewStudentService(
      mockStudentsRepository,
    )
    insertStudentInReportService = new InsertStudentInReportService(
      mockReportsRepository,
    )
    createNewReportService = new CreateNewReportService(
      mockReportsRepository,
    )
  })

  it('should be able insert student in report', async () => {
    const student = await createNewStudentService.execute({
      _id: new Types.ObjectId(),
      idTeacher: new Types.ObjectId().toString(),
    })

    const report = await createNewReportService.execute({
      name: 'Test report',
      idTeacher: new Types.ObjectId().toString(),
    })

    await insertStudentInReportService.execute({
      studentsIds: [student._id.toString()],
      reportId: report._id.toString(),
    })

    const updatedReport = await mockReportsRepository.findById(
      report._id.toString(),
    )

    expect(updatedReport.students).toContain(student._id.toString())
  })

  it('should not be able insert student in report if idReport not sent', async () => {
    await expect(async () => {
      const student = await createNewStudentService.execute({
        _id: new Types.ObjectId(),
        idTeacher: new Types.ObjectId().toString(),
      })

      await insertStudentInReportService.execute({
        studentsIds: [student._id.toString()],
        reportId: undefined,
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
