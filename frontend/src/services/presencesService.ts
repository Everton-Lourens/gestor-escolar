import http from '../api/http'
import { usersService } from './usersService'

interface UpdateParams {
  _id: string
  firstPresence: number
  secondPresence: number
}

export const presencesService = {
  getAll(idSubject: string, date: string) {
    return http.get(`/report/presence/subject/${idSubject}?${date}`)
  },

  update({ _id: idPresence, firstPresence, secondPresence }: UpdateParams) {
    const body = {
      firstPresence,
      secondPresence,
    }

    return http.put(`/presences/${idPresence}`, {
      ...body,
    })
  },

  getPresencesByStudent() {
    const studentId = usersService.getUserInfo()._id

    return http.get(`/presences/student/${studentId}`)
  },
}
