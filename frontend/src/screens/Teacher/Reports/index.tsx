import { reportsService } from '../../../services/reportsService'
import { HeaderPage } from '../../../components/HeaderPage'
import { useContext, useEffect, useState } from 'react'
import { ModalCreateNewReport } from './ModalCreateNewReport'
import { TableComponent } from '../../../components/TableComponent'
import { useColumns } from './hooks/useColumns'
import { AlertContext } from '../../../contexts/alertContext'
import { ModalAddStudents } from './ModalAddStudents'
import style from './Reports.module.scss'
import { ListMobile } from '../../../components/ListMobile'
import { useFieldsMobile } from './hooks/useFieldsMobile'
import { ModalGrades } from './ModalGrades'

export interface Report {
  data: ReportData;
}
/*
export interface Report {
  _id: string
  name: string
  students: string[]
}
*/
export function Reports() {
  const {
    alertDialogConfirmConfigs,
    setAlertDialogConfirmConfigs,
    alertNotifyConfigs,
    setAlertNotifyConfigs,
  } = useContext(AlertContext)
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | undefined>(
    undefined,
  )
  const [modalAddStudentsOpened, setModalAddStudentsOpened] =
    useState<boolean>(false)
  const [modalGradesOpened, setModalGradesOpened] = useState<boolean>(false)
  const [loadingReports, setLoadingReports] = useState<boolean>(true)
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false)

  function getReports() {
    setLoadingReports(true)
    reportsService
      .getAll()
      .then((res) => {
        setReports(res.data.items)
      })
      .catch((err) => {
        console.log('ERRO AO BUSCAR RELATÓRIO, ', err)
      })
      .finally(() => {
        setLoadingReports(false)
      })
  }

  useEffect(() => {
    getReports()
  }, [])

  function handleDeleteReport(report: Report) {
    setAlertDialogConfirmConfigs({
      ...alertDialogConfirmConfigs,
      open: true,
      title: 'Alerta de confirmação',
      text: 'Deseja realmente excluir esta turma?',
      onClickAgree: () => {
        reportsService
          .delete({ idReport: report?._id })
          .then(() => {
            setAlertNotifyConfigs({
              ...alertNotifyConfigs,
              open: true,
              type: 'success',
              text: 'Turma excluída com sucesso',
            })
            getReports()
          })
          .catch((err) => {
            setAlertNotifyConfigs({
              ...alertNotifyConfigs,
              open: true,
              type: 'error',
              text: `Erro ao tentar excluir turma (${err.response.data.message})`,
            })
          })
      },
    })
  }

  function handleAddStudents(report: Report) {
    setModalAddStudentsOpened(true)
    setSelectedReport(report)
  }

  function handleShowGrades(report: Report) {
    setModalGradesOpened(true)
    setSelectedReport(report)
  }

  const columns = useColumns({
    handleDeleteReport,
    handleAddStudents,
    handleShowGrades,
  })

  const fieldsMobile = useFieldsMobile()

  return (
    <>
      <HeaderPage
        buttonText="Nova turma"
        InputFilter={<h3>Turmas - {new Date().toLocaleDateString('pt-BR')}</h3>}
        onClickFunction={() => {
          setFormModalOpened(true)
        }}
      />

      <div className={style.viewDesktop}>
        <TableComponent
          loading={loadingReports}
          columns={columns}
          rows={reports}
          emptyText="Nenhuma turma cadastrada"
        />
      </div>
      <div className={style.viewMobile}>
        <ListMobile
          loading={loadingReports}
          collapseItems={columns}
          itemFields={fieldsMobile}
          items={reports}
          emptyText="Nenhuma turma cadastrada"
        />
      </div>

      {formModalOpened && (
        <ModalCreateNewReport
          reportDataToEdit={undefined}
          open={formModalOpened}
          getReports={getReports}
          handleClose={() => {
            setFormModalOpened(false)
          }}
        />
      )}

      {modalAddStudentsOpened && selectedReport && (
        <ModalAddStudents
          getReports={getReports}
          reportData={selectedReport}
          open={modalAddStudentsOpened}
          handleClose={() => {
            setModalAddStudentsOpened(false)
            setSelectedReport(undefined)
          }}
        />
      )}

      {modalGradesOpened && selectedReport && (
        <ModalGrades
          reportData={selectedReport}
          open={modalGradesOpened}
          handleClose={() => {
            setModalGradesOpened(false)
            setSelectedReport(undefined)
          }}
        />
      )}
    </>
  )
}
