import http from '../api/http'
import { NewReportData } from '../screens/Teacher/Reports/ModalCreateNewReport'

interface CreateParams {
  newReportData: NewReportData
}

interface UpdateParams {
  reportData: NewReportData
}

interface DeleteParams {
  idReport: string
}

interface InsertStudentsParams {
  selectedStudentsIdsToAdd: string[]
  reportId: string
}
interface RemoveStudentsParams {
  selectedStudentsIdsToRemove: string[]
  reportId: string
}

export const reportsService = {
  getAll(date: string, teacherId?: string) {
    return http.get(`/report/class-offer?${date}&teacherId=${teacherId}`); /////// ARRUMAR 
  },

  create({ newReportData }: CreateParams) {
    const body = {
      ...newReportData,
    }
    return http.post('/reports/', {
      ...body,
    })
  },

  update({ reportData }: UpdateParams) {
    return http.put('/reports/')
  },

  delete({ idReport }: DeleteParams) {
    return http.delete('/reports/' + idReport)
  },

  insertStudents({
    selectedStudentsIdsToAdd,
    reportId,
  }: InsertStudentsParams) {
    const body = {
      studentsIds: selectedStudentsIdsToAdd,
    }
    return http.put(`/reports/insertStudents/${reportId}`, {
      ...body,
    })
  },

  removeStudents({
    selectedStudentsIdsToRemove,
    reportId,
  }: RemoveStudentsParams) {
    const body = {
      studentsIds: selectedStudentsIdsToRemove,
    }

    return http.put(`/reports/removeStudents/${reportId}`, {
      ...body,
    })
  },
}
