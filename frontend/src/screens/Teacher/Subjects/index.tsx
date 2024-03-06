import { subjectsService } from '../../../services/subjectsService'
import { HeaderPage } from '../../../components/HeaderPage'
import { useContext, useEffect, useState } from 'react'
import { ModalCreateNewSubject } from './ModalCreateNewSubject'
import { TableComponent } from '../../../components/TableComponent'
import { useColumns } from './hooks/useColumns'
import { AlertContext } from '../../../contexts/alertContext'
import { ModalAddStudents } from './ModalAddStudents'
import style from './Subjects.module.scss'
import { ListMobile } from '../../../components/ListMobile'
import { useFieldsMobile } from './hooks/useFieldsMobile'
import { ModalGrades } from './ModalGrades'

export interface Subject {
  _id: string
  name: string
  students: string[]
}

export function Subjects() {
  const {
    alertDialogConfirmConfigs,
    setAlertDialogConfirmConfigs,
    alertNotifyConfigs,
    setAlertNotifyConfigs,
  } = useContext(AlertContext)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(
    undefined,
  )
  const [modalAddStudentsOpened, setModalAddStudentsOpened] =
    useState<boolean>(false)
  const [modalGradesOpened, setModalGradesOpened] = useState<boolean>(false)
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true)
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false)
/* ISSO FAZ APAGAR TODAS AS TURMAS CASO NÃO TENHA SIDO CRIADO HOJE
(estava testando a possibilidade de criar as turmas todos os dias que iniciar a EBD,
  mas agora com o botão de presença não é tão necessario, mas vou deixar commitado e sem usar)

  function getSubjects() {
    setLoadingSubjects(true)
    subjectsService
      .getAll()
      .then((res) => {
        
        for (let i = 0; i < res.data.items.length; i++) {
          const dateFromAPI = new Date(res.data.items[i].createdAt);
          const currentDate = new Date();
          // Cria novos objetos Date apenas para representar o dia (ignorando horas, minutos, segundos)
          const apiDateOnly = new Date(dateFromAPI.getFullYear(), dateFromAPI.getMonth(), dateFromAPI.getDate());
          const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
          // Compara os valores numéricos dos objetos Date criados
          const datesAreEqual = apiDateOnly.getTime() === currentDateOnly.getTime(); // Retorna true se o dia, mês e ano forem iguais
          const idSubject = res.data.items[i]._id;
          
          if (!datesAreEqual) {
            subjectsService
              .delete({ idSubject: idSubject })
              .then(() => {
                setAlertNotifyConfigs({
                  ...alertNotifyConfigs,
                  open: true,
                  type: 'success',
                  text: 'Turma excluída com sucesso',
                })
                getSubjects()
              })
              .catch((err) => {
                setAlertNotifyConfigs({
                  ...alertNotifyConfigs,
                  open: true,
                  type: 'error',
                  text: `Erro ao tentar excluir turma (${err.response.data.message})`,
                })
              })
          }
        }frontend/src/screens/Teacher/Subjects/index.tsx

        setSubjects(res.data.items)
      })
      .catch((err) => {
        console.log('ERRO AO BUSCAR TURMAS, ', err)
      })
      .finally(() => {
        setLoadingSubjects(false)
      })
  }
  */
 //////>>>>

  function getSubjects() {
    setLoadingSubjects(true)
    subjectsService
      .getAll()
      .then((res) => {
        setSubjects(res.data.items)
      })
      .catch((err) => {
        console.log('ERRO AO BUSCAR DISCIPLINAS, ', err)
      })
      .finally(() => {
        setLoadingSubjects(false)
      })
  }

  useEffect(() => {
    getSubjects()
  }, [])

  function handleDeleteSubject(subject: Subject) {
    setAlertDialogConfirmConfigs({
      ...alertDialogConfirmConfigs,
      open: true,
      title: 'Alerta de confirmação',
      text: 'Deseja realmente excluir esta turma?',
      onClickAgree: () => {
        subjectsService
          .delete({ idSubject: subject?._id })
          .then(() => {
            setAlertNotifyConfigs({
              ...alertNotifyConfigs,
              open: true,
              type: 'success',
              text: 'Turma excluída com sucesso',
            })
            getSubjects()
          })
          .catch((err) => {
            setAlertNotifyConfigs({
              ...alertNotifyConfigs,
              open: true,
              type: 'error',
              text: `Erro ao tentar excluir turma (${err.response.data.message})`,
            })
          })
      },
    })
  }

  function handleAddStudents(subject: Subject) {
    setModalAddStudentsOpened(true)
    setSelectedSubject(subject)
  }

  function handleShowGrades(subject: Subject) {
    setModalGradesOpened(true)
    setSelectedSubject(subject)
  }

  const columns = useColumns({
    handleDeleteSubject,
    handleAddStudents,
    handleShowGrades,
  })

  const fieldsMobile = useFieldsMobile()

  return (
    <>
      <HeaderPage
        buttonText="Nova turma"
        InputFilter={<h3>Turmas - {new Date().toLocaleDateString('pt-BR')}</h3>}
        onClickFunction={() => {
          setFormModalOpened(true)
        }}
      />

      <div className={style.viewDesktop}>
        <TableComponent
          loading={loadingSubjects}
          columns={columns}
          rows={subjects}
          emptyText="Nenhuma turma cadastrada"
        />
      </div>
      <div className={style.viewMobile}>
        <ListMobile
          loading={loadingSubjects}
          collapseItems={columns}
          itemFields={fieldsMobile}
          items={subjects}
          emptyText="Nenhuma turma cadastrada"
        />
      </div>

      {formModalOpened && (
        <ModalCreateNewSubject
          subjectDataToEdit={undefined}
          open={formModalOpened}
          getSubjects={getSubjects}
          handleClose={() => {
            setFormModalOpened(false)
          }}
        />
      )}

      {modalAddStudentsOpened && selectedSubject && (
        <ModalAddStudents
          getSubjects={getSubjects}
          subjectData={selectedSubject}
          open={modalAddStudentsOpened}
          handleClose={() => {
            setModalAddStudentsOpened(false)
            setSelectedSubject(undefined)
          }}
        />
      )}

      {modalGradesOpened && selectedSubject && (
        <ModalGrades
          subjectData={selectedSubject}
          open={modalGradesOpened}
          handleClose={() => {
            setModalGradesOpened(false)
            setSelectedSubject(undefined)
          }}
        />
      )}
    </>
  )
}
