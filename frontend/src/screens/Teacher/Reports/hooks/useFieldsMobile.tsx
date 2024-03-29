import { Field } from '../../../../components/ListMobile/interfaces/Field'

export function useFieldsMobile(): Field[] {
  return [
    {
      field: 'subjectName',
      valueFormatter: (params: any) => params?.value || '--',
    },
    {
      field: 'percentNumber',
      valueFormatter: (params: any) =>  `${params?.value}%` || '--',
    },
  ]
}