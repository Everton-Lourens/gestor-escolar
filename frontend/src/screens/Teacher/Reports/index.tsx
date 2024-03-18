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
import dayjs from 'dayjs'

export interface Report {
  subject: any
  _id: string
  name: string
  reports: string[]
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
  const [dateFilter, setDateFilter] = useState<object>({});

  const [valueTotal, setValueTotal] = useState<number>(0);

  function getReports(startDateResponseFromFilter = '', endDateResponseFromFilter = '') {
    setLoadingReports(true);

    reportsService
      .getAll(getDateQuery(startDateResponseFromFilter, endDateResponseFromFilter))
      .then((res) => {
        setReports(res.data.items)
        const total = {
          totalTithing: 0,
          totalOffer: 0
        };

        res.data.items.forEach((element: { tithing: number; offer: number }) => {
          total.totalTithing += element.tithing;
          total.totalOffer += element.offer;
        });
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
      @@@@@@@@ <br />
      Oferta total: {valueTotal?.totalTithing || 0}
      <br />
      Dízimo total: {valueTotal?.totalOffer || 0}
      <br />@@@@@@@@

      <br />
      <br />
      (Fazer com que mostre a porcentagem apenas se for o início e o fim sendo a mesma data, então pesquisa as presenças atuais em uma função "count" e coloca o json APENAS SE FOR OS DOIS NA MESMA DATA)
      <br />
      (deve poder saber quem teve mais presenças e porcentagem)
      <br />
      <br />
      criar um botão para ir ver o relatório individual onde mostra quem deu mais dizimos, presenças, etc.

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
          dateFilter={dateFilter}
          handleClose={() => {
            setModalPresencesOpened(false)
            setSelectedReport(undefined)
          }}
        />
      )}
    </>
  )
}