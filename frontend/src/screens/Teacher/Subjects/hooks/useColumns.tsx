import {
  faClipboard,
  faGraduationCap,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { Subject } from '..'
import style from '../Subjects.module.scss'
import { CellFunctionParams } from '../../../../components/TableComponent/interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface UseColumnsParams {
  handleDeleteSubject: (subject: Subject) => void
  handleAddStudents: (subject: Subject) => void
  handleShowGrades: (subject: Subject) => void
}

export function useColumns({
  handleDeleteSubject,
  handleAddStudents,
  handleShowGrades,
}: UseColumnsParams) {
  return [
    {
      headerName: 'Código',
      field: 'code',
      valueFormatter: (params: CellFunctionParams<Subject>) =>
        params.value || '--',
    },
    {
      headerName: 'Nome da turma',
      field: 'name',
      valueFormatter: (params: CellFunctionParams<Subject>) =>
        params.value || '--',
    },
    {
      headerName: 'Quantidade de alunos',
      field: 'students',
      valueFormatter: (params: CellFunctionParams<Subject>) =>
        params?.value?.length || 0,
    },
    {
      headerName: '',
      field: 'acoes',
      type: 'actions',
      cellRenderer: (params: CellFunctionParams<Subject>) => {
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
              <FontAwesomeIcon icon={faClipboard} className={style.icon} />
            </button>

            <button
              onClick={() => {
                handleDeleteSubject(params.data)
              }}
              className={style.deleteSubjectButton}
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
