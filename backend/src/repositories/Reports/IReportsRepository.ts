import { IReport } from '../../entities/report'

export interface INewReportDTO {
  name: string
  code?: string
  idTeacher: string
}

export interface IUpdate {
  fields: any
  idReport: string
}

export interface FiltersGetEntries {
  idTeacher: string
}

export interface IReportsRepository {
  list: (idTeacher: string) => Promise<IReport[]>
  create: (newReportData: INewReportDTO) => Promise<IReport>
  findById: (idReport: string) => Promise<IReport>
  delete: (idReport: string) => Promise<void>
  update: ({ fields, idReport }: IUpdate) => Promise<void>
  insertStudents: (idReport: string, studentsIds: string[]) => Promise<void>
  removeStudents: (idReport: string, studentsIds: string[]) => Promise<void>
  getEntries: ({ idTeacher }: FiltersGetEntries) => Promise<number>
  removeStudentFromAllReports: (idStudent: string) => Promise<void>
}
