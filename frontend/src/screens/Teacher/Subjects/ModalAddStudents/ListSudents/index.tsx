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

type Props = {
  students: any[]
  handleSelectItem: (student: Student) => void
  customCheckboxColor?: string
  loading?: boolean
  emptyText?: string
}

const handleButtonClick = async (item: { _id: any }) => {
  try {
    // TRABALHANDO
    const response = await http.post(`/presence`);
    console.log('item');
    console.log(item);
    console.log('item');
    return http.post(`/presence`, { body: item })

    console.log(response)

  } catch (error) {
    // Lógica para lidar com erros de rede ou outros erros
    //console.error('Erro durante o POST:', error.message);
  }
};


export function ListStudent({
  students,
  handleSelectItem,
  loading,
  customCheckboxColor,
  emptyText,
}: Props) {
  return (
    <List className={style.list}>
      {!loading &&
        students?.length > 0 &&
        students?.map((item: any) => {
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
                  color="primary"
                  size="small"
                  onClick={() => {
                    handleButtonClick(item)
                  }}
                >
                  Presente
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
