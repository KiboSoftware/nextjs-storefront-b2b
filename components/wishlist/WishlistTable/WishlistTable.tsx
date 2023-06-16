import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FolderCopySharpIcon from '@mui/icons-material/FolderCopySharp'
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
  styled,
  CircularProgress,
} from '@mui/material'
import { GridRenderCellParams, GridColumnVisibilityModel } from '@mui/x-data-grid'

import WishlistOptionsMobile from '../WishlistOptionsMobile/WishlistOptionsMobile'
import { KiboDataTable, KiboPagination } from '@/components/common'

const customIconButton = {
  fontWeight: '400 !important',
  lineHeight: '19px !important',
  fontSize: '16px !important',
  color: '#000000 !important',
  textDecoration: 'underline !important',
}
export interface WishlistTableProps {
  handleEditWishlist: any
  handleCopyWishlist: any
  handleDeleteWishlist: any
  rows: any[]
  isLoading: boolean
  setPage: (value: number) => void
  pageCount: number
}

const PaginationContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '-3.5rem',
})

const WishlistTable = (props: WishlistTableProps) => {
  const { isLoading, pageCount, setPage, rows } = props
  const theme = useTheme()
  const mdScreen = useMediaQuery<any>(theme.breakpoints.up('md'))
  return (
    <>
      <KiboDataTable
        columnVisibilityModel={{
          createBy: mdScreen,
        }}
        columns={[
          {
            field: 'name',
            headerName: 'List Name',
            type: 'string',
            sortable: false,
            filterable: false,
            flex: mdScreen ? 2 : 7,
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
            flex: mdScreen ? 1 : 3,
            headerClassName: 'super-app-theme--header',
          },
          {
            field: 'createBy',
            headerName: mdScreen ? 'Created By' : '',
            type: 'string',
            sortable: false,
            filterable: false,
            flex: 2,
            headerClassName: 'super-app-theme--header',
          },
          {
            field: 'actions',
            headerName: '',
            type: 'string',
            sortable: false,
            filterable: false,
            flex: mdScreen ? 2 : 1,
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
                    <Button id={params?.row?.id} sx={customIconButton} data-testid="initiate-quote">
                      Initiate Quote
                    </Button>
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
        sx={{ opacity: isLoading ? 0.5 : 1 }}
        rows={rows || []}
      />
      <PaginationContainer>
        <KiboPagination
          count={pageCount}
          onChange={setPage}
          size="small"
          sx={{ paddingLeft: '-1.5rem' }}
        />
        {/* <Typography
          sx={{
            textAlign: 'end',
            color: theme.palette.grey[600],
            width: { xs: '10rem', md: '12rem' },
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        > */}
        {/* {mdScreen && 'Displaying '} {startRange} - {endRange} of {totalCount} */}
        {/* </Typography> */}
      </PaginationContainer>
    </>
  )
}

export default WishlistTable
