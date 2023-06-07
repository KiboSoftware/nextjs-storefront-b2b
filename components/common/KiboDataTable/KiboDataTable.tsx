import { Box, CircularProgress, SxProps, Theme, styled } from '@mui/material'
import { DataGrid, GridColumnVisibilityModel } from '@mui/x-data-grid'

interface KiboDataTableProps {
  columns: any[]
  rows: any[] | undefined
  columnVisibilityModel?: GridColumnVisibilityModel
  loading?: boolean
  sx?: SxProps<any>
}

const DataGridBox = styled(Box)(({ theme }: { theme: Theme }) => ({
  width: '100%',
  '& .MuiDataGrid-root': {
    border: 'none',
  },
  '& .MuiDataGrid-columnHeadersInner .div': {
    width: '100%',
  },
  '& .super-app-theme--header': {
    backgroundColor: theme.palette.grey[100],
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
}))

const KiboDataTable = (props: KiboDataTableProps) => {
  const { columns, rows, columnVisibilityModel, loading, sx } = props

  return (
    <DataGridBox sx={sx}>
      <DataGrid
        columnVisibilityModel={columnVisibilityModel}
        columns={columns}
        disableColumnMenu
        hideFooterPagination
        hideFooterSelectedRowCount
        rows={rows || []}
        loading={loading}
      />
    </DataGridBox>
  )
}

export default KiboDataTable
