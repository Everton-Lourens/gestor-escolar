import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grade } from '..'
import { CellFunctionParams } from '../../../../../components/TableComponent/interfaces'
import style from '../ModalGrades.module.scss'
import { faPlus,faEye } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

type Props = {
  handleEditGrades: (grade: Grade) => void
}

export function useColumns({ handleEditGrades }: Props) {

  const [valueSend, setValueSend] = useState(0);

  return [
    {
      headerName: 'Aluno',
      field: 'student',
      valueFormatter: (params: CellFunctionParams<Grade>) =>
        params?.value?.name || '--',
    },
    /*
        {
          headerName: 'Total',
          field: 'firstGrade',
          valueFormatter: (params: CellFunctionParams<Grade>) =>
            (params?.value || 0).toFixed(2),
        },
    */
    {
      headerName: 'Histórico / Adicionar',
      field: 'acoes',
      type: 'actions',
      cellRenderer: (params: CellFunctionParams<Grade>) => {
        //console.log('@@@@@@@@@@@@@@@');
        //console.log(params.data);
        /*
{
    "_id": "65eb7a078b29e359dfd48665",
    "student": {
        "_id": "65e73c908ca2b06d027a76d0",
        "code": "3",
        "name": "teste",
        "email": "teste@teste.com",
        "password": "$2b$10$FxGNH/aoik3ULbG7x1vxuuDpI7GMdweCxP1OUZPzNueNQ7fZX3rE2",
        "occupation": "student",
        "avatar": null,
        "avatarURL": null,
        "teacher": "65e641c85d7e2314d26a6a82",
        "warningsAmount": 0,
        "createdAt": "2024-03-05T15:38:56.030Z",
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
    "firstGrade": 0,
    "secondGrade": 0,
    "createdAt": "2024-03-08T20:50:15.904Z",
    "__v": 0
}
        */
        //console.log('@@@@@@@@@@@@@@@');
        return (

          <div className={style.actionButtonsContainer}>
            <button
              onClick={() => {
                window.location.href = '/teacher/report/' + params.data.student._id;
              }}
              className={style.editGradesButton}
              type="button"
            >
              <FontAwesomeIcon icon={faEye} className={style.icon} />
            </button>
            <button
              onClick={() => {
                handleEditGrades(params.data)
              }}
              className={style.editGradesButton}
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} className={style.icon} />
            </button>
          </div>
        )
      },
    },
  ]
}
