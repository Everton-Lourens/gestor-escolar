import {
  faGraduationCap,
  faDollarSign,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { Report } from '..'
import style from '../Reports.module.scss'
import { CellFunctionParams } from '../../../../components/TableComponent/interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface UseColumnsParams {
  handleDeleteReport: (report: Report) => void
  handleAddStudents: (report: Report) => void
  handleShowPresences: (report: Report) => void
}

export function useColumns({
  handleDeleteReport,
  handleAddStudents,
  handleShowPresences,
}: UseColumnsParams) {

  return [
    {
      headerName: 'Turma',
      field: 'subjectName',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        params.value || '--',
    },
    {
      headerName: 'Alunos',
      field: 'countStudents',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        `${params?.value || 0}`,
    },
    {
      headerName: 'Presenças',
      field: 'presence',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        params.value || '--',
    },
    {
      headerName: 'Dízimos',
      field: 'tithing',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        `${params?.value || 0},00`,
    },
    {
      headerName: 'Ofertas',
      field: 'offer',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        `${params?.value || 0},00`,
    },
    {
      headerName: '',
      field: 'acoes',
      type: 'actions',
      cellRenderer: (params: CellFunctionParams<Report>) => {
        /*
DAQUI VEM O ID DA TURMA
        */
        return (
          <div className={style.actionButtonsContainer}>
            <button
              onClick={() => {
                window.location.href = `/teacher/reports/${params.data._id}`
                return;
                MOSTRAR_RELATÓRIO_INDIVIDUAL(params.data);
                //handleAddStudents(params.data)
              }}
              className={style.insertStudentsButton}
              type="button"
            >
              <FontAwesomeIcon icon={faGraduationCap} className={style.icon} />
            </button>

            <button
              onClick={() => {
                handleShowPresences(params.data)
              }}
              className={style.showPresencesButton}
              type="button"
            >
              <FontAwesomeIcon icon={faDollarSign} className={style.icon} />
            </button>

            <button
              onClick={() => {
                handleDeleteReport(params.data)
              }}
              className={style.deleteReportButton}
              type="button"
            >
              <FontAwesomeIcon icon={faTrash} className={style.icon} />
            </button>
          </div>
        )
      },
    },
  ]
}
