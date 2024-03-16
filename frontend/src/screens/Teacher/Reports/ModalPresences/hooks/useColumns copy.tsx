import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Presence } from '..'
import { CellFunctionParams } from '../../../../../components/TableComponent/interfaces'
import style from '../ModalPresences.module.scss'
import { faPen } from '@fortawesome/free-solid-svg-icons'

type Props = {
  handleEditPresences: (presence: Presence) => void
}

export function useColumns({ handleEditPresences }: Props) {
  return [
    {
      headerName: 'Aluno',
      field: 'student',
      valueFormatter: (params: CellFunctionParams<Presence>) =>
        params?.value?.name || '--',
    },
    {
      headerName: 'Nota 1',
      field: 'firstPresence',
      valueFormatter: (params: CellFunctionParams<Presence>) =>
        (params?.value || 0).toFixed(2),
    },
    {
      headerName: 'Nota 2',
      field: 'secondPresence',
      valueFormatter: (params: CellFunctionParams<Presence>) =>
        (params?.value || 0).toFixed(2),
    },
    {
      headerName: 'Total',
      field: 'total',
      valueFormatter: (params: CellFunctionParams<Presence>) =>
        ((params?.data.firstPresence + params.data.secondPresence || 0) / 2).toFixed(
          2,
        ),
    },
    {
      headerName: 'Alterar',
      field: 'acoes',
      type: 'actions',
      cellRenderer: (params: CellFunctionParams<Presence>) => {
        console.log('@@@@@@@@@@@@@@@');
        console.log(params.data);
        console.log('@@@@@@@@@@@@@@@');
        return (
          <div className={style.actionButtonsContainer}>
            <button
              onClick={() => {
                handleEditPresences(params.data)
              }}
              className={style.editPresencesButton}
              type="button"
            >
              <FontAwesomeIcon icon={faPen} className={style.icon} />
            </button>
          </div>
        )
      },
    },
  ]
}
