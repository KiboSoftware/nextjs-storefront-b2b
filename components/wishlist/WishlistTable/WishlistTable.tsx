import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FolderCopySharpIcon from '@mui/icons-material/FolderCopySharp'
import { Box, Typography, IconButton, useMediaQuery, useTheme, createTheme } from '@mui/material'
import { GridRenderCellParams, GridColumnVisibilityModel } from '@mui/x-data-grid'

import WishlistOptionsMobile from '../WishlistOptionsMobile/WishlistOptionsMobile'
import { KiboDataTable } from '@/components/common'
import Pagination from '@/components/common/KiboPagination/KiboPagination'

const customIconButton = {
  fontWeight: '400 !important',
  lineHeight: '19px !important',
  fontSize: '16px !important',
  color: '#000000 !important',
  textDecoration: 'underline !important',
}
export interface WishlistTableProps {
  hiddenColumns: GridColumnVisibilityModel
  handleEditWishlist: any
  handleCopyWishlist: any
  handleDeleteWishlist: any
  rows: any[]
  pageOnChange: any
  pageCount: number
}

const WishlistTable = (props: WishlistTableProps) => {
  const theme = useTheme()
  const mdScreen = useMediaQuery<any>(theme.breakpoints.up('md'))

  return (
    <>
      <KiboDataTable
        columnVisibilityModel={props.hiddenColumns}
        columns={[
          {
            field: 'name',
            headerName: 'List Name',
            type: 'string',
            sortable: false,
            filterable: false,
            flex: !mdScreen ? 6 : 2,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams<any>) => {
              return (
                <>
                  <Box>
                    <Typography>{params?.row?.name}</Typography>
                    {mdScreen ? null : (
                      <Typography
                        component={'caption'}
                        style={{ fontSize: '13px', color: '#7c7c7c' }}
                      >
                        {params?.row?.createBy}
                      </Typography>
                    )}
                  </Box>
                </>
              )
            },
          },
          {
            field: 'createDate',
            headerName: 'Date created',
            type: 'string',
            sortable: false,
            filterable: false,
            flex: !mdScreen ? 3 : 1,
            headerClassName: 'super-app-theme--header',
          },
          {
            field: 'createBy',
            headerName: mdScreen ? 'Created By' : '',
            type: 'string',
            sortable: false,
            filterable: false,
            flex: mdScreen ? 2 : 1,
            headerClassName: 'super-app-theme--header',
            columnVisibilityModel: {
              status: false,
              traderName: false,
            },
            renderCell: (params: GridRenderCellParams<any>) => {
              return (
                <>
                  {!mdScreen ? null : (
                    <Box>
                      <Typography>{params.row.createBy}</Typography>
                    </Box>
                  )}
                </>
              )
            },
          },
          {
            field: 'actions',
            headerName: '',
            type: 'string',
            sortable: false,
            filterable: false,
            flex: !mdScreen ? 1 : 2,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams<any>) => (
              <>
                {!mdScreen ? (
                  <WishlistOptionsMobile
                    id={params?.row?.id}
                    editWishlist={props.handleEditWishlist}
                    deleteWishlist={props.handleDeleteWishlist}
                    copyWishlist={props.handleCopyWishlist}
                    initiateQuote={() => console.log('Work in Progress')}
                    addAllToCart={() => console.log('Work in Progress')}
                  />
                ) : (
                  <>
                    <IconButton
                      id={params?.row?.id}
                      sx={customIconButton}
                      data-testid="initiate-quote"
                    >
                      Initiate Quote
                    </IconButton>
                    <IconButton id={params?.row?.id} sx={customIconButton}>
                      Add to Cart
                    </IconButton>
                    <IconButton
                      id={params?.row?.id}
                      sx={customIconButton}
                      onClick={props.handleEditWishlist}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      id={params?.row?.id}
                      sx={customIconButton}
                      onClick={props.handleCopyWishlist}
                    >
                      <FolderCopySharpIcon />
                    </IconButton>
                    <IconButton
                      id={params?.row?.id}
                      sx={customIconButton}
                      onClick={props.handleDeleteWishlist}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </>
            ),
          },
        ]}
        rows={props.rows || []}
      />
      <Pagination count={props.pageCount} onChange={props.pageOnChange} size="medium" />
    </>
  )
}

export default WishlistTable
