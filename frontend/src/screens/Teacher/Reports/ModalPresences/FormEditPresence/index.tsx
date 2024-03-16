import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Presence } from '..'
import { CustomTextField } from '../../../../../components/CustomTextField'
import style from './FormEditPresence.module.scss'
import { useState } from 'react';
import { faAngleLeft, faDollar } from '@fortawesome/free-solid-svg-icons'

type Props = {
  presenceToEditData: Presence
  setPresenceToEditData: (presenceData: Presence) => void
  handleBack: () => void
}

export function FormEditPresence({
  handleBack,
  presenceToEditData,
  setPresenceToEditData,
}: Props) {

  return (
    <div className={style.inputsContainer}>
      <button onClick={handleBack} className={style.backButton} type="button">
        <FontAwesomeIcon className={style.icon} icon={faAngleLeft} />
        Voltar
      </button>

      <CustomTextField
        label="Dizimo"
        value={presenceToEditData.firstPresence}
        onChange={(event) => {
          setPresenceToEditData({
            ...presenceToEditData,
            firstPresence: parseFloat(event.target.value) || 0,
          })
        }}
      />

      <CustomTextField
        label="Oferta"
        value={presenceToEditData.secondPresence}
        onChange={(event) => {
          setPresenceToEditData({
            ...presenceToEditData,
            secondPresence: parseFloat(event.target.value) || 0,
          })
        }}
      />
    </div>
  )
}
