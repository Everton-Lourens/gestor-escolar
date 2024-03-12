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
  handleShowGrades: (report: Report) => void
}

export function useColumns({
  handleDeleteReport,
  handleAddStudents,
  handleShowGrades,
}: UseColumnsParams) {

  return [
    {
      headerName: 'Nome',
      field: 'studentName',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        params.value || '--',
    },
    {
      headerName: 'Turma',
      field: 'className',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        params.value || '--',
    },
    {
      headerName: 'Dízimos',
      field: 'tithing',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        params?.value || 0,
    },
    {
      headerName: 'Ofertas',
      field: 'offer',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        params?.value || 0,
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
                handleAddStudents(params.data)
              }}
              className={style.insertStudentsButton}
              type="button"
            >
              <FontAwesomeIcon icon={faGraduationCap} className={style.icon} />
            </button>

            <button
              onClick={() => {
                handleShowGrades(params.data)
              }}
              className={style.showGradesButton}
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
