import { ModalLayout } from '../../../../components/ModalLayout'
import { useState, useEffect, FormEvent, useContext } from 'react'
import { Subject } from '..'
import { gradesService } from '../../../../services/gradesService'
import { ListMobile } from '../../../../components/ListMobile'
import { useFieldsMobile } from './hooks/useFieldsMobile'
import { useColumns } from './hooks/useColumns'
import { TableWithOneComponent } from '../../../../components/TableComponent'
import style from './ModalGrades.module.scss'
import { FormEditGrade } from './FormEditGrade'
import { AlertContext } from '../../../../contexts/alertContext'
import http from '../../../../api/http';

interface Props {
  subjectData: Subject
  open: boolean
  handleClose: () => void
}

export interface Grade {
  _id: string
  firstGrade: number
  secondGrade: number
  student: {
    name: string
  }
  subject: {
    name: string
  }
}

export function ModalGrades({ open, handleClose, subjectData }: Props) {
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)

  const [loadingGetGrades, setLoadingGetGrades] = useState<boolean>(true)
  const [loadingUpdateGrades, setLoadingUpdateGrade] = useState<boolean>(false)
  const [editGradeMode, setEditGradeMode] = useState<boolean>(false)
  const [gradeToEditData, setGradeToEditData] = useState<Grade | null>(null)
  const [grades, setGrades] = useState<Grade[]>([])

  function getGrades() {
    setLoadingGetGrades(true)
    gradesService
      .getAll(subjectData._id)
      .then((res) => {
        setGrades(res.data.items)
      })
      .catch((err) => {
        console.log(
          `Erro ao buscar notas - ${err?.response?.data?.message || err?.message
          }`,
        )
      })
      .finally(() => {
        setLoadingGetGrades(false)
      })
  }

  function handleEditGrades(grade: Grade) {
    setEditGradeMode(true)
    setGradeToEditData(grade)
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
        "subject": {
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
        "firstGrade": 62,
        "secondGrade": 0,
        "createdAt": "2024-03-08T20:50:15.903Z",
        "__v": 0
    }
    */
  };

  function onUpdateGrades(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!gradeToEditData) return


    // Adicionando código IMPROVISADO para salvar a nova como se fosse o dinheiro
    const newGradeToEditData = { ...gradeToEditData }
    newGradeToEditData.firstGrade = Number(newGradeToEditData.firstGrade) + Number(newGradeToEditData.secondGrade);
    newGradeToEditData.subject.offer = newGradeToEditData.secondGrade;
    newGradeToEditData.secondGrade = 0;

    setLoadingUpdateGrade(true)
    gradesService
      .update(newGradeToEditData)
      .then(() => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          text: 'Notas atualizadas com suceso',
          type: 'success',
        })
        getGrades()
        setEditGradeMode(false)

        handleButtonClick(newGradeToEditData);
      })
      .catch((err) => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          text: `Erro ao tentar atualizar notas - ${err?.response?.data?.message || err?.message
            }`,
          type: 'error',
        })
      })
      .finally(() => {
        setLoadingUpdateGrade(false)
      })
  }

  const columns = useColumns({ handleEditGrades })
  const fieldsMobile = useFieldsMobile()

  useEffect(() => {
    getGrades()
  }, [])

  return (
    <ModalLayout
      open={open}
      handleClose={handleClose}
      title="Oferta da turma"
      submitButtonText={editGradeMode ? 'Confirmar' : ''}
      onSubmit={editGradeMode ? onUpdateGrades : undefined}
      loading={loadingUpdateGrades}
    >
      {editGradeMode && gradeToEditData && (
        <FormEditGrade
          gradeToEditData={gradeToEditData}
          setGradeToEditData={setGradeToEditData}
          handleBack={() => {
            setEditGradeMode(false)
            setGradeToEditData(null)
          }}
        />
      )}

      {!editGradeMode && (
        <>
          <div className={style.viewDesktop}>
            <TableWithOneComponent
              rows={grades}
              loading={loadingGetGrades}
              columns={columns}
              emptyText="Nenhum aluno cadastrado na turma"
            />
          </div>

          <div className={style.viewMobile}>
            <ListMobile
              emptyText="Nenhum aluno cadastrado na turma"
              itemFields={fieldsMobile}
              collapseItems={columns}
              items={grades}
              loading={loadingGetGrades}
            />
          </div>
        </>
      )}
    </ModalLayout>
  )
}
