import { Model } from 'mongoose'
import { IReport, ReportModel } from '../../entities/report'
import {
  IReportsRepository,
  INewReportDTO,
  IUpdate,
} from './IReportsRepository'

export class ReportsRepository implements IReportsRepository {
  model: Model<IReport>
  constructor() {
    this.model = ReportModel
  }

  async list(idTeacher: string): Promise<IReport[]> {
    return await this.model.find({ teacher: idTeacher })
  }

  async findById(idReport: string): Promise<IReport> {
    return await this.model.findOne({ _id: idReport }).populate('students')
  }

  async delete(idReport: string): Promise<void> {
    await this.model.deleteOne({ _id: idReport })
  }

  async create({ name, code, idTeacher }: INewReportDTO): Promise<IReport> {
    const newReport = await this.model.create({
      name,
      code,
      teacher: idTeacher,
    })

    await newReport.save()

    return newReport
  }

  async update({ fields, idReport }: IUpdate): Promise<void> {
    await this.model.updateOne({ _id: idReport }, { $set: fields })
  }

  async getEntries({ idTeacher }): Promise<number> {
    return await this.model.countDocuments({ teacher: idTeacher })
  }

  async insertStudents(
    idReport: string,
    studentsIds: string[],
  ): Promise<void> {
    await this.model.updateOne(
      { _id: idReport },
      { $push: { students: { $each: studentsIds } } },
    )
  }

  async removeStudents(
    idReport: string,
    studentsIds: string[],
  ): Promise<void> {
    await this.model.updateOne(
      { _id: idReport },
      { $pull: { students: { $in: studentsIds } } },
    )
  }

  async removeStudentFromAllReports(idStudent: string) {
    await this.model.updateMany(
      { students: idStudent },
      {
        $pull: { students: idStudent },
      },
    )
  }
}
