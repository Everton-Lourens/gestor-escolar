/*
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListAllReportsService } from '../useCases/Report/ListAllReports/ListAllReportsService.service'
import { CreateNewReportService } from '../useCases/Report/CreateNewReport/CreateNewReportService.service'
import { DeleteReportService } from '../useCases/Report/DeleteReport/DeleteReportService.service'
import { InsertStudentsInReportService } from '../useCases/Report/InsertStudentInReport/InsertStudentsInReportService.service'
import { RemoveStudentsInReportService } from '../useCases/Report/RemoveStudentInReport/RemoveStudentsInReportService.service'

export class ReportController {
  async listAllReports(req: Request, res: Response): Promise<Response> {
    const { _id: idTeacher } = req.user

    const listAllReportsService = container.resolve(ListAllReportsService)
    const reports = await listAllReportsService.execute({ idTeacher })

    return res.status(200).json({
      success: true,
      message: 'Busca de disciplinas concluída com sucesso',
      items: reports,
    })
  }

  async createNewReport(req: Request, res: Response): Promise<Response> {
    const { name } = req.body
    const { _id: idTeacher } = req.user

    const createNewReportService = container.resolve(CreateNewReportService)
    const newReport = await createNewReportService.execute({
      name,
      idTeacher,
    })

    return res.status(201).json({
      success: true,
      item: newReport,
      message: 'Disciplina cadastrada com sucesso.',
    })
  }

  async deleteReport(req: Request, res: Response): Promise<Response> {
    const { idReport } = req.params

    const deleteReportService = container.resolve(DeleteReportService)
    await deleteReportService.execute(idReport)

    return res.status(202).json({
      success: true,
      message: 'Disciplina excluída com sucesso',
    })
  }

  async insertStudents(req: Request, res: Response): Promise<Response> {
    const { idReport } = req.params
    const { studentsIds } = req.body

    const insertStudentsInReportService = container.resolve(
      InsertStudentsInReportService,
    )

    await insertStudentsInReportService.execute({
      studentsIds,
      idReport,
    })

    return res.status(202).json({
      message: 'Estudante(s) foram inseridos na disciplina com sucesso.',
    })
  }

  async removeStudents(req: Request, res: Response): Promise<Response> {
    const { idReport } = req.params
    const { studentsIds } = req.body

    const removeStudentsInReportService = container.resolve(
      RemoveStudentsInReportService,
    )

    await removeStudentsInReportService.execute({
      studentsIds,
      idReport,
    })

    return res.status(202).json({
      message: 'Estudante(s) foram removidos da disciplina com sucesso.',
    })
  }
}

*/