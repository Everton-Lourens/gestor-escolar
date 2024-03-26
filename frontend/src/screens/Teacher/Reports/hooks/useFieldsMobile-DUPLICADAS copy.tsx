import { Field } from '../../../../components/ListMobile/interfaces/Field'

export function useFieldsMobile(): Field[] {
  return [
    {
      field: 'subjectName',
      valueFormatter: (params: any) => params?.value || '--',
    },
    {
      field: 'percentNumber',
      valueFormatter: (params: any) => Number(params?.value) <= 100 ? `${params?.value}%` : (Number(params?.value) > 100 ? `(inválido)` : '--'),
    },
  ]
}