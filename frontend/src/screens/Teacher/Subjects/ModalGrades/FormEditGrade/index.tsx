import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grade } from '..'
import { CustomTextField } from '../../../../../components/CustomTextField'
import style from './FormEditGrade.module.scss'
import { useState } from 'react';
import { faAngleLeft, faPen } from '@fortawesome/free-solid-svg-icons'

type Props = {
  gradeToEditData: Grade
  setGradeToEditData: (gradeData: Grade) => void
  handleBack: () => void
}

export function FormEditGrade({
  handleBack,
  gradeToEditData,
  setGradeToEditData,
}: Props) {

  const [disabledTotal, setDisabledTotal] = useState(true);

  return (
    <div className={style.inputsContainer}>
      <button onClick={handleBack} className={style.backButton} type="button">
        <FontAwesomeIcon className={style.icon} icon={faAngleLeft} />
        Voltar
      </button>

      <button onClick={() => setDisabledTotal(!disabledTotal)} className={style.backButton} type="button">
        <FontAwesomeIcon className={style.icon} icon={faPen} />
        Editar Total
      </button>

      <CustomTextField
        label="Total"
        value={gradeToEditData.firstGrade}
        disabled={disabledTotal}
        onChange={(event) => {
          setGradeToEditData({
            ...gradeToEditData,
            firstGrade: parseFloat(event.target.value) || 0,
          })
        }}
      />
      <CustomTextField
        label="Adicionar Oferta"
        value={gradeToEditData.secondGrade}
        onChange={(event) => {
          setGradeToEditData({
            ...gradeToEditData,
            secondGrade: parseFloat(event.target.value) || 0,
          })
        }}
      />
    </div>
  )
}
