import { Types } from 'mongoose'
import { IReport } from '../../entities/report'
import {
  IInsertStudentDTO,
  INewReportDTO,
  IReportsRepository,
} from './IReportsRepository'

export class MockReportsRepository implements IReportsRepository {
  reports: IReport[] = []

  async list(query: any): Promise<IReport[]> {
    return this.reports
  }

  async create(newReportData: INewReportDTO): Promise<IReport> {
    const newReport = {
      ...newReportData,
      students: null,
      _id: new Types.ObjectId(),
    }

    this.reports.push(newReport)

    return newReport
  }

  async findById(idReport: string | Types.ObjectId): Promise<IReport> {
    return this.reports.find((report) => report._id.toString() === idReport)
  }

  async delete(idReport: string): Promise<void> {
    this.reports = this.reports.filter(
      (report) => report._id.toString() !== idReport,
    )
  }

  async insertStudent({
    studentsIds,
    reportId,
  }: IInsertStudentDTO): Promise<void> {
    const indexReport = this.reports.findIndex(
      (report) => report._id.toString() === reportId,
    )

    if (indexReport !== -1) {
      this.reports[indexReport].students = studentsIds
    }
  }

  async getEntries(): Promise<number> {
    return this.reports.length
  }
}
