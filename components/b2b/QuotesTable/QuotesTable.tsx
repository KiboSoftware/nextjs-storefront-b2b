import React, { useCallback } from 'react'

import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import FiberManualRecord from '@mui/icons-material/FiberManualRecord'
import FilterList from '@mui/icons-material/FilterList'
import Mail from '@mui/icons-material/Mail'
import MoreVert from '@mui/icons-material/MoreVert'
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { KiboPagination, KiboSelect, Price, SearchBar } from '@/components/common'
import { EmailQuoteDialog, QuotesFilterDialog } from '@/components/dialogs'
import { useModalContext } from '@/context'
import { quoteGetters } from '@/lib/getters'

import { QuoteCollection } from '@/lib/gql/types'

interface SortingValues {
  value: string
  id: string
}

interface QuotesTableProps {
  quoteCollection: QuoteCollection
  sortingValues: {
    options: SortingValues[]
    selected: string
  }
}

const desktopColumns = [
  {
    field: 'quoteNumber',
    headerName: '#',
  },
  {
    field: 'quoteName',
    headerName: 'name',
  },
  {
    field: 'expirationDate',
    headerName: 'expires-on',
  },
  {
    field: 'createdDate',
    headerName: 'created-date',
  },
  {
    field: 'total',
    headerName: 'total',
  },
  {
    field: 'status',
    headerName: 'status',
  },
  {
    field: 'actions',
    headerName: '',
  },
]

const mobileColumns = [
  {
    field: 'status',
    headerName: '',
  },
  {
    field: 'quoteNumber',
    headerName: '#',
  },
  {
    field: 'quoteName',
    headerName: 'name',
  },
  {
    field: 'expirationDate',
    headerName: 'expires-on',
  },
  {
    field: 'actions',
    headerName: '',
  },
]

const statusColorCode: any = {
  Pending: 'disabled',
  InReview: 'warning',
  ReadyForCheckout: 'success',
}

const QuotesTable = (props: QuotesTableProps) => {
  const { quoteCollection, sortingValues } = props
  const { t } = useTranslation('common')
  const theme = useTheme()
  const { showModal } = useModalContext()
  const tabAndDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const [searchTerm, setSearchTerm] = React.useState('')

  const getStatusColorCode = useCallback((status: string) => {
    return statusColorCode[status]
  }, [])

  // Mobile Actions
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEditQuote = () => {
    handleClose()
  }

  const handleEmailQuote = () => {
    showModal({ Component: EmailQuoteDialog })
    handleClose()
  }

  const handleDeleteQuote = () => {
    handleClose()
  }

  const handleFilterButtonClick = () => {
    showModal({ Component: QuotesFilterDialog })
  }

  const handleQuoteSearch = (term: string) => {
    setSearchTerm(term)
  }

  const quotes = quoteGetters.getQuotes(quoteCollection)

  const columns = tabAndDesktop ? desktopColumns : mobileColumns

  const onSortItemSelection = (value: any) => null

  return (
    <>
      <Box
        sx={{
          paddingInline: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pb: 1,
        }}
      >
        <Box width="100%">
          <SearchBar searchTerm={searchTerm} onSearch={handleQuoteSearch} showClearButton />
        </Box>
        <Box width="100%" display="flex" justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <KiboSelect
              name="sort-plp"
              sx={{ typography: 'body2' }}
              // value={sortingValues?.selected}
              placeholder={t('sort-by')}
              onChange={(_name, value) => onSortItemSelection(value)}
            >
              {sortingValues?.options?.map((sortingVal: any) => (
                <MenuItem sx={{ typography: 'body2' }} key={sortingVal?.id} value={sortingVal?.id}>
                  {sortingVal?.value}
                </MenuItem>
              ))}
            </KiboSelect>
          </Box>
          <Box>
            <Tooltip title="Filter list">
              <IconButton onClick={handleFilterButtonClick}>
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ maxWidth: '100%', whiteSpace: 'nowrap' }}
          aria-label="quick order table"
          size="small"
        >
          <TableHead>
            <TableRow
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              {columns.map((column) => (
                <TableCell component={'th'} key={column.field} sx={{ fontWeight: 700 }}>
                  {t(column.headerName)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {!Boolean(quotes.length) ? (
            <caption>{t('no-quotes-found')}</caption>
          ) : (
            <TableBody>
              {quotes.map((quote) => {
                const { number, name, expirationDate, createdDate, total, status } =
                  quoteGetters.getQuoteDetails(quote)
                return (
                  <TableRow
                    key={quote.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {!tabAndDesktop ? (
                      <TableCell size="small" component="td" scope="row" variant={'body'}>
                        <FiberManualRecord fontSize="small" color={getStatusColorCode(status)} />
                      </TableCell>
                    ) : null}
                    <TableCell component="td" scope="row">
                      <Typography variant="body2">{number}</Typography>
                    </TableCell>
                    <TableCell component="td" scope="row">
                      <Typography variant="body2">{name}</Typography>
                    </TableCell>
                    <TableCell component="td" scope="row">
                      <Typography variant="body2">{expirationDate || '24-07-2023'}</Typography>
                    </TableCell>
                    {tabAndDesktop ? (
                      <>
                        <TableCell component="td" scope="row">
                          <Typography variant="body2">{createdDate}</Typography>
                        </TableCell>
                        <TableCell component="td" scope="row">
                          <Price variant="body2" price={t('currency', { val: total.toString() })} />
                        </TableCell>
                        <TableCell component="td" scope="row">
                          <Box display={'flex'} gap={1}>
                            <FiberManualRecord
                              fontSize="small"
                              color={getStatusColorCode(status)}
                            />
                            <Typography variant="body2">{status}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell component="td" scope="row" align="right">
                          <Box display={'flex'} justifyContent={'flex-end'}>
                            <IconButton size="small" onClick={handleEditQuote}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={handleEmailQuote}>
                              <Mail fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={handleDeleteQuote}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell component="td" scope="row" align="right">
                          <IconButton size="small" onClick={handleClick}>
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          )}
        </Table>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleEditQuote}>
            <Typography variant="body2">{t('edit-quote')}</Typography>
          </MenuItem>
          <MenuItem onClick={handleEmailQuote}>
            <Typography variant="body2">{t('email-quote')}</Typography>
          </MenuItem>
          <MenuItem onClick={handleDeleteQuote}>
            <Typography variant="body2">{t('delete-quote')}</Typography>
          </MenuItem>
        </Menu>
      </TableContainer>
      <Box pt={2}>
        <KiboPagination
          count={quoteCollection.totalCount}
          pageSize={quoteCollection.pageSize}
          startIndex={quoteCollection.startIndex}
          onPaginationChange={() => null}
        />
      </Box>
    </>
  )
}

export default QuotesTable
