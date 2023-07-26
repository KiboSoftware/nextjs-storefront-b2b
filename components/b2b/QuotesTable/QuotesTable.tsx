import React, { useMemo } from 'react'

import { Delete, Edit, FilterList, Mail, MoreVert } from '@mui/icons-material'
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
  Toolbar,
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
    headerName: 'quote-number',
  },
  {
    field: 'quoteName',
    headerName: 'quote-name',
  },
  {
    field: 'expirationDate',
    headerName: 'expiration-date',
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
    field: 'quoteNumber',
    headerName: 'number',
  },
  {
    field: 'quoteName',
    headerName: 'name',
  },
  {
    field: 'expirationDate',
    headerName: 'expiration-date',
  },
  {
    field: 'actions',
    headerName: '',
  },
]

const QuotesTable = (props: QuotesTableProps) => {
  const { quoteCollection, sortingValues } = props
  const { t } = useTranslation('common')
  const theme = useTheme()
  const { showModal } = useModalContext()
  const tabAndDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const [searchTerm, setSearchTerm] = React.useState('')

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
      <Toolbar
        sx={{
          paddingInline: 0,
        }}
      >
        <Box>
          <SearchBar searchTerm={searchTerm} onSearch={handleQuoteSearch} showClearButton />
        </Box>
        <Box ml="auto" display="flex" alignItems={'center'}>
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
      </Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: '100%' }} aria-label="quick order table" size="small">
          <TableHead>
            <TableRow
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ fontWeight: 700 }}>
                  {t(column.headerName)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {!quotes.length ? (
            <caption>{t('no-quotes-found')}</caption>
          ) : (
            <TableBody>
              {quotes.length &&
                quotes.map((quote) => {
                  const { number, name, expirationDate, createdDate, total, status } =
                    quoteGetters.getQuoteDetails(quote)
                  return (
                    <TableRow
                      key={quote.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography variant="body2">{number}</Typography>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography variant="body2">{name}</Typography>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography variant="body2">{expirationDate || '24-07-2023'}</Typography>
                      </TableCell>
                      {tabAndDesktop ? (
                        <>
                          <TableCell component="th" scope="row">
                            <Typography variant="body2">{createdDate}</Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Price
                              variant="body2"
                              price={t('currency', { val: total.toString() })}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography variant="body2">{status}</Typography>
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            <IconButton onClick={handleEditQuote}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={handleEmailQuote}>
                              <Mail />
                            </IconButton>
                            <IconButton onClick={handleDeleteQuote}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell component="th" scope="row">
                            <IconButton onClick={handleClick}>
                              <MoreVert />
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
          <MenuItem onClick={handleEditQuote}>{t('edit-quote')}</MenuItem>
          <MenuItem onClick={handleEmailQuote}>{t('email-quote')}</MenuItem>
          <MenuItem onClick={handleDeleteQuote}>{t('delete-quote')}</MenuItem>
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
