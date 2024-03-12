import { ModalLayout } from '../../../../components/ModalLayout'
import { FormEvent, useState, useContext } from 'react'
import style from './ModalCreateNewReport.module.scss'
import { CustomTextField } from '../../../../components/CustomTextField'
import { reportsService } from '../../../../services/reportsService'
import { AlertContext } from '../../../../contexts/alertContext'

export interface NewReportData {
  name: string
  stock: string
  value: string
  isDefault: boolean
}

interface Props {
  reportDataToEdit: NewReportData | undefined
  open: boolean
  handleClose: () => void
  getReports: () => void
}

export function ModalCreateNewReport({
  open,
  handleClose,
  reportDataToEdit,
  getReports,
}: Props) {
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)
  const defaultNewReportValues = {
    name: '',
    stock: '0',
    value: '0',
    isDefault: false,
  }
  const [newReportData, setNewReportData] = useState<NewReportData>(
    reportDataToEdit || defaultNewReportValues,
  )
  const [loadingCreateNewReport, setLoadingCreateNewReport] =
    useState<boolean>(false)

  function onCreateNewReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newReportData?.name) {
      setAlertNotifyConfigs({
        ...alertNotifyConfigs,
        open: true,
        type: 'error',
        text: 'Nenhum nome foi informado',
      })
      return
    }
    reportsService
      .create({ newReportData })
      .then(() => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: 'success',
          text: 'Turma cadastrada com sucesso',
        })

        setNewReportData(defaultNewReportValues)
        handleClose()
        getReports()
      })
      .catch((err) => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: 'error',
          text:
            'Erro ao tentar cadastrar turma ' +
            `(${err?.response?.data?.message || err?.message})`,
        })
      })
      .finally(() => {
        setLoadingCreateNewReport(false)
      })
  }

  function onEditReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newReportData?.name) {
      setAlertNotifyConfigs({
        ...alertNotifyConfigs,
        open: true,
        type: 'error',
        text: 'Nenhum nome foi informado',
      })
      return
    }
    reportsService
      .update({ reportData: newReportData })
      .then(() => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: 'success',
          text: 'Dados da turma atualizados com sucesso',
        })
        setNewReportData(defaultNewReportValues)
        handleClose()
        getReports()
      })
      .catch((err) => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: 'error',
          text:
            'Erro ao tentar atualizar dados da turma ' +
            `(${err?.response?.data?.message || err?.message})`,
        })
      })
      .finally(() => {
        setLoadingCreateNewReport(false)
      })
  }

  return (
    <ModalLayout
      open={open}
      handleClose={handleClose}
      onSubmit={reportDataToEdit ? onEditReport : onCreateNewReport}
      title="Cadastro de turma"
      submitButtonText="Cadastrar"
      loading={loadingCreateNewReport}
    >
      <div className={style.fieldsContainer}>
        <CustomTextField
          size="small"
          required
          label="Nome"
          type="text"
          placeholder="Digite o nome"
          value={newReportData?.name}
          onChange={(event) => {
            setNewReportData({
              ...newReportData,
              name: event.target.value,
            })
          }}
        />
      </div>
    </ModalLayout>
  )
}
