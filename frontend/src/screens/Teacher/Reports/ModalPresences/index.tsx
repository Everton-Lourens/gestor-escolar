import { ModalLayout } from '../../../../components/ModalLayout'
import { useState, useEffect, FormEvent, useContext } from 'react'
import { Report } from '..'
import { presencesService } from '../../../../services/presencesService'
import { ListMobile } from '../../../../components/ListMobile'
import { useFieldsMobile } from './hooks/useFieldsMobile'
import { useColumns } from './hooks/useColumns'
import { TableComponent } from '../../../../components/TableComponent'
import style from './ModalPresences.module.scss'
import { FormEditPresence } from './FormEditPresence'
import { AlertContext } from '../../../../contexts/alertContext'
import http from '../../../../api/http';

interface Props {
  reportData: Report
  open: boolean
  handleClose: () => void
  dateFilter: {
    dateQuery: string,
    startDate: string,
    endDate: string
  }
}

export interface Presence {
  _id: string;
  subjectName: string;
  nameStudent: string;
  presence: boolean;
  teacher: string; // Assume-se que o tipo ObjectId seja representado como string
  student: string; // Assume-se que o tipo ObjectId seja representado como string
  subject: string; // Assume-se que o tipo ObjectId seja representado como string
  createdAt: string; // Assume-se que a data seja representada como string ISO 8601
  __v: number;
}

export function ModalPresences({ open, handleClose, reportData, dateFilter }: Props) {
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)

  const [loadingGetPresences, setLoadingGetPresences] = useState<boolean>(true)
  const [loadingUpdatePresences, setLoadingUpdatePresence] = useState<boolean>(false)
  const [editPresenceMode, setEditPresenceMode] = useState<boolean>(false)
  const [presenceToEditData, setPresenceToEditData] = useState<Presence | null>(null)
  const [presences, setPresences] = useState<Presence[]>([])
  const [showDateFilter, setShowDateFilter] = useState<object>({})

  function getPresences() {
    const subjectId: string = reportData?.subject[0]?._id;
    const teacherId: string = reportData?.teacher[0]?._id;

    if (!subjectId || !teacherId) return;
    // BUSCAR VALORES ANTIGOS
    setLoadingGetPresences(true)
    presencesService
      .getAll(subjectId, dateFilter?.dateQuery, teacherId)
      .then((res) => {
        setPresences(res.data.items);
        setShowDateFilter(dateFilter);
      })
      .catch((err) => {
        console.log(
          `Erro ao buscar notas - ${err?.response?.data?.message || err?.message
          }`,
        )
      })
      .finally(() => {
        setLoadingGetPresences(false)
      })
  }

  function handleEditPresences(presence: Presence) {
    setEditPresenceMode(true)
    setPresenceToEditData(presence)
  }

  const handleButtonClick = async (item: { _id: any }) => {
    // Enviando para o relacionamento improvisado de tabelas para puxar com a data da oferta
    await http.post(`/class-offer`, { data: item });
    //console.log('$$$$$$$$$$$');
    //console.log(item);
    //console.log('$$$$$$$$$$$');
    /*
    {
        "_id": "65eb7a078b29e359dfd48663",
        "student": {
            "_id": "65e6421e5d7e2314d26a6aa3",
            "code": "1",
            "name": "João",
            "email": "joao@gmail.com",
            "password": "$2b$10$87rSYt.r32Vxzn06AKMotej1XfOWGcXc/NZzchPI2N25y9UPeCOP2",
            "occupation": "student",
            "avatar": null,
            "avatarURL": null,
            "teacher": "65e641c85d7e2314d26a6a82",
            "warningsAmount": 1,
            "createdAt": "2024-03-04T21:50:22.772Z",
            "__v": 0
        },
        "report": {
            "_id": "65eb74468b29e359dfd4860a",
            "code": "1",
            "name": "Jovens",
            "students": [
                "65e6421e5d7e2314d26a6aa3",
                "65e64693c5250fd1e67f8927",
                "65e73c908ca2b06d027a76d0",
                "65e7ad442f436f4502356fae"
            ],
            "teacher": "65e641c85d7e2314d26a6a82",
            "createdAt": "2024-03-08T20:25:42.442Z",
            "__v": 0
        },
        "firstPresence": 62,
        "secondPresence": 0,
        "createdAt": "2024-03-08T20:50:15.903Z",
        "__v": 0
    }
    */
  };

  function onUpdatePresences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!presenceToEditData) return


    // Adicionando código IMPROVISADO para salvar a nova como se fosse o dinheiro
    const newPresenceToEditData = { ...presenceToEditData }
    newPresenceToEditData.report.tithing = newPresenceToEditData.firstPresence;
    newPresenceToEditData.report.offer = newPresenceToEditData.secondPresence;
    newPresenceToEditData.firstPresence = 0;
    newPresenceToEditData.secondPresence = 0;

    setLoadingUpdatePresence(true)
    presencesService
      .update(newPresenceToEditData)
      .then(() => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          text: 'Valores atualizados com suceso',
          type: 'success',
        })
        getPresences()
        setEditPresenceMode(false)

        handleButtonClick(newPresenceToEditData);
      })
      .catch((err) => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          text: `Erro ao tentar atualizar os valores - ${err?.response?.data?.message || err?.message
            }`,
          type: 'error',
        })
      })
      .finally(() => {
        setLoadingUpdatePresence(false)
      })
  }

  const columns = useColumns({ handleEditPresences })
  const fieldsMobile = useFieldsMobile()

  useEffect(() => {
    getPresences()
  }, [])

  return (
    <ModalLayout
      open={open}
      handleClose={handleClose}
      title={`Presenças (${reportData.subjectName.toUpperCase()}) — ${new Date(showDateFilter?.startDate).toLocaleDateString('pt-BR')} ATÉ ${new Date(showDateFilter?.endDate).toLocaleDateString('pt-BR')}`}
      submitButtonText={editPresenceMode ? 'Confirmar' : ''}
      onSubmit={editPresenceMode ? onUpdatePresences : undefined}
      loading={loadingUpdatePresences}
    >
      {editPresenceMode && presenceToEditData && (
        <FormEditPresence
          presenceToEditData={presenceToEditData}
          setPresenceToEditData={setPresenceToEditData}
          handleBack={() => {
            setEditPresenceMode(false)
            setPresenceToEditData(null)
          }}
        />
      )}

      {!editPresenceMode && (
        <>
          <div className={style.viewDesktop}>
            <TableComponent
              rows={presences}
              loading={loadingGetPresences}
              columns={columns}
              emptyText="Nenhuma presença registrada"
            />
          </div>

          <div className={style.viewMobile}>
            <ListMobile
              emptyText="Nenhuma presença registrada"
              itemFields={fieldsMobile}
              collapseItems={columns}
              items={presences}
              loading={loadingGetPresences}
            />
          </div>
        </>
      )}
    </ModalLayout>
  )
}
