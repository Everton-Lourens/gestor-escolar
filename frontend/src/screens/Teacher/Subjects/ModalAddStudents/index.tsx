import { ModalLayout } from '../../../../components/ModalLayout'
import { FormEvent, useState, useContext, useEffect } from 'react'
import { subjectsService } from '../../../../services/subjectsService'
import { AlertContext } from '../../../../contexts/alertContext'
import { Subject } from '..'
import { studentsService } from '../../../../services/studentsService'
import { MenuSelectList } from './MenuSelectList'
import { ListStudent } from './ListSudents'

interface Props {
  subjectData: Subject
  open: boolean
  handleClose: () => void
  getSubjects: () => void
}

export interface Student {
  _id: string
  name: string
  checked?: boolean
  subject: object;
}

export function ModalAddStudents({
  open,
  handleClose,
  subjectData,
  getSubjects,
}: Props) {
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)

  const [loadingForm, setLoadingForm] = useState<boolean>(false)
  const [loadingGetStudents, setLoadingGetStudents] = useState<boolean>(true)
  const [registeredStudents, setRegisteredStudents] = useState<Student[]>([])
  const [otherStudents, setOtherStudents] = useState<Student[]>([])
  const [menuSelected, setMenuSelected] = useState<string>('included')

  function onAddStudents(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoadingForm(true)


    const selectedStudentsIdsToAdd = otherStudents
      .filter((student) => student?.checked)
      .map((student) => student._id)

    subjectsService
      .insertStudents({ selectedStudentsIdsToAdd, subjectId: subjectData?._id })
      .then(() => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: 'success',
          text: 'Presença marcada com sucesso',
        })
        getSubjects()
        handleClose()
      })
      .catch((err) => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: 'error',
          text:
            'Erro ao tentar marcar presença dos alunos ' +
            `(${err?.response?.data?.message || err?.message})`,
        })
      })
      .finally(() => {
        setLoadingForm(false)
      })
  }

  function onRemoveStudents(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoadingForm(true)

    const selectedStudentsIdsToRemove = registeredStudents
      .filter((student) => student?.checked)
      .map((student) => student._id)

    subjectsService
      .removeStudents({
        selectedStudentsIdsToRemove,
        subjectId: subjectData?._id,
      })
      .then(() => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: 'success',
          text: 'Falta marcada com sucesso',
        })
        getSubjects()
        handleClose()
      })
      .catch((err) => {
        setAlertNotifyConfigs({
          ...alertNotifyConfigs,
          open: true,
          type: 'error',
          text:
            'Erro ao tentar marcar falta dos alunos ' +
            `(${err?.response?.data?.message || err?.message})`,
        })
      })
      .finally(() => {
        setLoadingForm(false)
      })
  }

  function getStudents() {

    setLoadingGetStudents(true)
    studentsService
      .getAll()
      .then((res) => {
        separateStudents(res.data.items)
      })
      .catch((err) => {
        console.log('Erro ao buscar alunos, ' + err.response.data.message)
      })
      .finally(() => {
        setLoadingGetStudents(false)
      })
  }

  function separateStudents(students: Student[]) {
    const newStudents = [...students]
    const _registeredStudents: Student[] = []
    const _otherStudents: Student[] = []

    newStudents.forEach((student) => {
      const studentInserted = subjectData?.students?.includes(student?._id)

      if (studentInserted) {
        student.subject = subjectData;
        _registeredStudents.push(student)
      } else {
        _otherStudents.push(student)
      }
    })

    setRegisteredStudents(_registeredStudents)
    setOtherStudents(_otherStudents)
  }

  function handleSelectStudentToAdd(student: Student) {
    const copyOtherStudent = [...otherStudents]

    copyOtherStudent.forEach((currentStudent) => {
      if (currentStudent._id === student._id) {
        currentStudent.checked = !currentStudent.checked
      }
    })

    setOtherStudents(copyOtherStudent)
  }

  function handleSelectStudentToRemove(student: Student) {
    const copyRegisteredStudents = [...registeredStudents]

    copyRegisteredStudents.forEach((currentStudent) => {
      if (currentStudent._id === student._id) {
        currentStudent.checked = !currentStudent.checked
      }
    })

    setRegisteredStudents(copyRegisteredStudents)
  }

  function getSubmitFunction() {
    if (menuSelected === 'included' && registeredStudents.length > 0) {
      return onRemoveStudents
    }
    if (menuSelected === 'other' && otherStudents.length > 0) {
      return onAddStudents
    }

    return undefined
  }

  useEffect(() => {
    getStudents()
  }, [])

  return (
    <ModalLayout
      open={open}
      handleClose={handleClose}
      onSubmit={getSubmitFunction()}
      title={
        (menuSelected === 'included' ? `LISTA DE CHAMADA (${subjectData.name})` : `TODOS OS ALUNOS`)

        /* NÃO MOSTRA MAIS A DATA AO LADO DO TITULO
        (menuSelected === 'included' ? 'ALUNOS DESTA TURMA' : 'TODOS OS ALUNOS') +
        ` — (${new Date().toLocaleDateString('pt-BR')})`
        */
      }
      submitButtonText={menuSelected === 'included' ? 'Remover >' : '< Adicionar à turma'}
      loading={loadingForm}
      customStyleButton={
        menuSelected === 'other' ? { backgroundColor: '#3264ff' } : {}
      }
    >
      <MenuSelectList
        menuSelected={menuSelected}
        setMenuSelected={setMenuSelected}
      />

      {menuSelected === 'included' && (
        <ListStudent
          customCheckboxColor="#aa2834"
          students={registeredStudents}
          handleSelectItem={handleSelectStudentToRemove}
          loading={loadingGetStudents}
          emptyText="Nenhum aluno incluído na turma"
        />
      )}

      {menuSelected === 'other' && (
        <ListStudent
          customCheckboxColor="#3264ff"
          students={otherStudents}
          handleSelectItem={handleSelectStudentToAdd}
          loading={loadingGetStudents}
        />
      )}
    </ModalLayout>
  )
}
