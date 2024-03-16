export function useFieldsMobile() {
  return [
    {
      field: 'nameStudent',
      valueFormatter: (params: any) => params?.data?.nameStudent || '--',
    },
  ]
}
