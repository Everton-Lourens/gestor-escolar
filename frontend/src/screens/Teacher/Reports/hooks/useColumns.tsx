import {
  faExternalLinkAlt,
  faList,
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
      field: 'studentsNumber',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        params?.value || '--',
    },
    {
      headerName: 'Presenças',
      field: 'presenceNumber',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        params.value || '--',
    },
    {
      headerName: 'Porcentagem',
      field: 'percentNumber',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        Number(params?.value) <= 100 ? `${params?.value}%` : (Number(params?.value) > 100 ? `+100%` : '--'),
    },
    {
      headerName: 'Ofertas',
      field: 'offer',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        params?.value ? `${params?.value},00` : '--',
    },
    {
      headerName: 'Dízimos',
      field: 'tithing',
      valueFormatter: (params: CellFunctionParams<Report>) =>
        params?.value ? `${params?.value},00` : '--',
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
                handleShowPresences(params.data)
              }}
              className={style.showPresencesButton}
              type="button"
            >
              <FontAwesomeIcon icon={faList} className={style.icon} />
            </button>

            <button
              disabled={true}
              onClick={() => {
                window.location.href = `/teacher/reports/${params.data._id}`
                return;
                //handleAddStudents(params.data)
              }}
              className={style.insertStudentsButton}
              type="button"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className={style.icon} />
            </button>

          </div>
        )
      },
    },
  ]
}
