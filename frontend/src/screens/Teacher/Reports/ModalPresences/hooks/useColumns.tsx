import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Presence } from '..'
import { CellFunctionParams } from '../../../../../components/TableComponent/interfaces'
import style from '../ModalPresences.module.scss'
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

type Props = {
  handleEditPresences: (presence: Presence) => void
}

export function useColumns({ handleEditPresences }: Props) {

  const [valueSend, setValueSend] = useState(0);

  return [
    {
      headerName: 'Aluno',
      field: 'subjectName',
      valueFormatter: (params: CellFunctionParams<Presence>) =>
        params?.data?.nameStudent || '--',
    },
    {
      headerName: 'Presença',
      field: 'presence',
      valueFormatter: (params: CellFunctionParams<Presence>) =>
        params?.data?.presence ? 'Presente' : 'Falta',
    },
    {
      headerName: 'Qtd.',
      field: 'presence',
      valueFormatter: (params: CellFunctionParams<Presence>) =>
        params?.data?.presenceCount || 0,
    },
    /*
    {
      headerName: 'Histórico / Adicionar',
      field: 'acoes',
      type: 'actions',
      cellRenderer: (params: CellFunctionParams<Presence>) => {
        return (

          <div className={style.actionButtonsContainer}>
            <button
              onClick={() => {
                window.location.href = '/teacher/report/' + params.data.student._id;
              }}
              className={style.editPresencesButton}
              type="button"
            >
              <FontAwesomeIcon icon={faEye} className={style.icon} />
            </button>
            <button
              onClick={() => {
                handleEditPresences(params.data)
              }}
              className={style.editPresencesButton}
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} className={style.icon} />
            </button>
          </div>
        )
      },
    },
    */
  ]
}
