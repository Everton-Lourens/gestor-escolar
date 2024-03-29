import {
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Button,
  ListItemButton,
  Skeleton,
} from '@mui/material'
import style from './ListMobile.module.scss'
import { EmptyItems } from '../../../../../components/EmptyItems'
import { Student } from '..';
import http from '../../../../../api/http';
import { useState, useContext } from 'react';
import { AlertContext } from '../../../../../contexts/alertContext'

type Props = {
  students: any[]
  handleSelectItem: (student: Student) => void
  customCheckboxColor?: string
  loading?: boolean
  emptyText?: string
}


export function ListStudent({
  students,
  handleSelectItem,
  loading,
  customCheckboxColor,
  emptyText,
}: Props) {
  const [buttonConfigs, setButtonConfigs] = useState<{ [key: string]: { text: string; color: string } }>({});
  const { alertNotifyConfigs, setAlertNotifyConfigs } = useContext(AlertContext)

  const handleButtonClick = async (item: { _id: any, presence: any }) => {
    // TRABALHANDO1

    //if (!item['subject']) {
    if (typeof item['_id'] === 'undefined') {
      setAlertNotifyConfigs({
        ...alertNotifyConfigs,
        open: true,
        type: 'error',
        text: 'Aluno não é da turma',
      });
      return
    }
    /*
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    COLOCAR NOTIFICAÇÃO PARA QUANDO SALVAR A PRESENÇA OU FALTA E
    INFORMAR QUE FOI COM SUCESSO (EXEMPLO ACIMA)
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    */

    const currentConfig = buttonConfigs[item._id] || { text: 'FALTA', color: 'secondary' };

    let callList = false;
    if (currentConfig.text.includes('FALTA')) // CLICOU EM PRESENÇA?? QUER MARCAR FALTA E VICE VERSA!
      callList = true;

    item.presence = callList;

    try {
      await http.post(`/presence`, { user: item });

      const isPrecence = currentConfig.text.includes('PRESENTE');

      setButtonConfigs((prevConfigs) => ({
        ...prevConfigs,
        [item._id]: {
          text: isPrecence ? 'FALTA' : 'PRESENTE',
          color: isPrecence ? 'error' : 'primary', // ou qualquer outra cor desejada
        },
      }));
      setAlertNotifyConfigs({
        ...alertNotifyConfigs,
        open: true,
        type: 'success',
        text: 'Salvo',
      })
    } catch (e) { }
  };


  return (
    <List className={style.list}>
      {!loading &&
        students?.length > 0 &&
        students?.map((item: any) => {
          const buttonConfig = buttonConfigs[item._id] || { text: 'MARCAR', color: 'secondary' };

          return (
            <div
              style={{ opacity: loading ? 0.5 : 1 }}
              key={item._id}
              className={style.groupItem}
            >
              <ListItem className={style.listItem}>
                <FormControlLabel
                  label={<span className={style.label}>{item.name}</span>}
                  className={style.controlLabel}
                  control={
                    <Checkbox
                      checked={item.checked}
                      onChange={() => {
                        handleSelectItem(item)
                      }}
                      sx={{
                        ...(customCheckboxColor
                          ? { '&.Mui-checked': { color: customCheckboxColor } }
                          : {}),
                      }}
                    />
                  }
                />
                <Button
                  variant="contained"
                  color={buttonConfig.color as any}
                  size="small"
                  style={{ visibility: !item['subject'] ? 'hidden' : 'visible' }}
                  onClick={() => {
                    handleButtonClick(item)
                  }}
                >
                  {buttonConfig.text}
                </Button>
              </ListItem>
            </div>
          )
        })}


      {(students.length === 0 || !students) && !loading && (
        <EmptyItems text={emptyText || 'Nenhum aluno encontrado'} />
      )}

      {(!students || students.length === 0) &&
        loading &&
        [1, 2, 3].map((item) => {
          return (
            <div key={item} className={style.groupItem}>
              <ListItemButton className={style.listItem}>
                <Skeleton
                  variant="text"
                  height={40}
                  width={150}
                  sx={{
                    fontSize: '1rem',
                    borderRadius: 15,
                  }}
                />
              </ListItemButton>
            </div>
          )
        })}
    </List>
  )
}


/*
<Button
  variant="contained"
  color="secondary"  // Alterado para a cor vermelha (pode variar dependendo do tema)
  size="small"
  onClick={() => {
    handleButtonClick(item)
  }}
>
  Falta
</Button>
*/




/*<Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    handleButtonClick(item)
                  }}
                >
                  {buttonText}
                </Button>
                */
