import style from './MenuSelectList.module.scss'
import { AlertContext } from '../../../../../contexts/alertContext'
import { useContext } from 'react';

type Props = {
  menuSelected: string
  setMenuSelected: (menuSelected: string) => void
}

export function MenuSelectList({ menuSelected, setMenuSelected }: Props) {
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)

  return (
    <nav className={style.menuContainer}>
      <button
        onClick={() => {
          setMenuSelected('included')
        }}
        disabled={menuSelected === 'included'}
        type="button"
        className={style.included}
      >
        Alunos desta turma
      </button>
      <button
        onClick={() => {
          setMenuSelected('other')
          setAlertNotifyConfigs({
            ...alertNotifyConfigs,
            open: true,
            type: 'error',
            text: 'Reiniciando lista de chamada',
          });
        }}
        disabled={menuSelected === 'other'}
        className={style.other}
        type="button"
      >
        Adicionar alunos
      </button>
    </nav>
  )
}
