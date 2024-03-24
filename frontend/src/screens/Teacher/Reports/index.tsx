import { reportsService } from '../../../services/reportsService'
import { HeaderPageReport } from '../../../components/HeaderPage'
import { useContext, useEffect, useState } from 'react'
import { ModalCreateNewReport } from './ModalCreateNewReport'
import { TableComponent } from '../../../components/TableComponent'
import { useColumns } from './hooks/useColumns'
import { AlertContext } from '../../../contexts/alertContext'
import { ModalAddStudents } from './ModalAddStudents'
import style from './Reports.module.scss'
import { ListMobile } from '../../../components/ListMobile'
import { useFieldsMobile } from './hooks/useFieldsMobile'
import { ModalPresences } from './ModalPresences'
import { FilterDate } from '../../../components/FilterDate'
import { usersService } from '../../../../src/services/usersService'
import dayjs from 'dayjs'

export interface Report {
  subject: any
  _id: string
  students: string
  name: string
  reports: string[]
  subjectName: string;
  teacher: any
}

interface ValueTotal {
  totalOffer?: number;
  totalTithing?: number;
  totalStudents?: number;
  totalPercent?: number;
  totalPresence?: number;
}

interface dateFilter {
  dateQuery?: string;
  startDate?: string;
  endDate?: string;
}

export function Reports() {

  function getDateQuery(startDateResponseFromFilter = '', endDateResponseFromFilter = '') {
    // Isso é refundância mas tudo bem (startDate e endDate já tem esse código do "dayjs" armazenado)
    const startOfToday = dayjs(new Date()).startOf('day').toISOString();
    const endOfToday = dayjs(new Date()).endOf('day').toISOString();

    const dateQuery = `startDate=${startDateResponseFromFilter || startOfToday}&endDate=${endDateResponseFromFilter || endOfToday}`;
    setDateFilter({
      startDate,
      endDate,
      dateQuery,
    });
    return dateQuery;
  }

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
  const [modalPresencesOpened, setModalPresencesOpened] = useState<boolean>(false)
  const [loadingReports, setLoadingReports] = useState<boolean>(true)
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false)

  const startOfToday = dayjs(new Date()).startOf('day').toISOString();
  const endOfToday = dayjs(new Date()).endOf('day').toISOString();
  const [startDate, setStartDate] = useState<string>(startOfToday);
  const [endDate, setEndDate] = useState<string>(endOfToday);
  const [dateFilter, setDateFilter] = useState<dateFilter>({ dateQuery: '', startDate: '', endDate: '' });
  const [valueTotal, setValueTotal] = useState<ValueTotal>({ totalOffer: 0, totalTithing: 0, totalStudents: 0, totalPercent: 0, totalPresence: 0 });

  function getReports(startDateResponseFromFilter = '', endDateResponseFromFilter = '') {
    setLoadingReports(true);
    const userInfo = usersService.getUserInfoByCookie()
    const teacherId = userInfo?.occupation === 'teacher' ? userInfo._id : '';
    const dateFormatted = getDateQuery(startDateResponseFromFilter, endDateResponseFromFilter);

    reportsService
      .getAll(dateFormatted, teacherId)
      .then((res) => {
        setReports(res.data.items)
        const total = {
          totalTithing: 0,
          totalOffer: 0,
          totalStudents: 0,
          totalPercent: 0,
          totalPresence: 0,
        };

        res.data.items.forEach((element: {
          tithing: number;
          offer: number,
          studentsNumber: number,
          presenceNumber: number,
        }) => {
          total.totalTithing += element.tithing;
          total.totalOffer += element.offer;
          total.totalStudents += element.studentsNumber;
          total.totalPresence += element.presenceNumber;
        });
        const percent = (Number(total.totalPresence) || 0) / (Number(total.totalStudents)) * 100;
        total.totalPercent = parseFloat(percent.toFixed(1)) || 0.00;

        setValueTotal(total);
      })
      .catch((err) => {
        console.log('ERRO AO BUSCAR RELATÓRIO, ', err)
      })
      .finally(() => {
        setLoadingReports(false)
      })
  }

  useEffect(() => {
    getReports();
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
            getReports();
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

  function handleShowPresences(report: Report) {
    setModalPresencesOpened(true)
    setSelectedReport(report)
    getDateQuery(startDate, endDate);
  }

  const columns = useColumns({
    handleDeleteReport,
    handleAddStudents,
    handleShowPresences,
  })

  const fieldsMobile = useFieldsMobile()

  return (
    <>
      <HeaderPageReport
        InputFilter={<h3>Relatório — {new Date(startDate).toLocaleDateString('pt-BR')} até {new Date(endDate).toLocaleDateString('pt-BR')}</h3>}
      />

      <FilterDate
        onClickFunction={
          function (startDateResponseFromFilter = '', endDateResponseFromFilter = '') {
            setStartDate(startDateResponseFromFilter);
            setEndDate(endDateResponseFromFilter);
            getReports(startDateResponseFromFilter, endDateResponseFromFilter);
            getDateQuery(startDateResponseFromFilter, endDateResponseFromFilter);
          }}
      />

      <br />
      {/*JSON.stringify(reports[3].subject[0].students.length)*/}
      {/*JSON.stringify(reports[0].subject[0].students)*/}
      {/*reports['total'].offer*/}
      =================
      <br />
      <i>Oferta total: {valueTotal?.totalOffer || 0},00</i>
      <i>Dízimo total: {valueTotal?.totalTithing || 0},00</i>
      <i>Total de estudantes: {valueTotal?.totalStudents || 0}</i>
      <i>Presença total: {valueTotal?.totalPresence || 0}</i>
      <i>Porcentagem total: {valueTotal?.totalPercent || 0.00}%</i>
      =================

      <div className={style.viewDesktop}>
        <TableComponent
          loading={loadingReports}
          columns={columns}
          rows={reports}
          emptyText="Nada cadastrado"
        />
      </div>
      <div className={style.viewMobile}>
        <ListMobile
          loading={loadingReports}
          collapseItems={columns}
          itemFields={fieldsMobile}
          items={reports}
          emptyText="Nada cadastrado"
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

      {modalPresencesOpened && selectedReport && (
        <ModalPresences
          reportData={selectedReport}
          open={modalPresencesOpened}
          dateFilter={{
            dateQuery: dateFilter?.dateQuery as string,
            startDate: dateFilter.startDate as string,
            endDate: dateFilter.endDate as string,
          }}
          handleClose={() => {
            setModalPresencesOpened(false)
            setSelectedReport(undefined)
          }}
        />
      )}
    </>
  )
}