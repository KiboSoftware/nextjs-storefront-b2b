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

import { KiboPagination, Price } from '@/components/common'
import { quoteGetters } from '@/lib/getters'
import { CategorySearchParams } from '@/lib/types'

import { Quote, QuoteCollection } from '@/lib/gql/types'

interface QuotesTableProps {
  quoteCollection: QuoteCollection
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
  const { quoteCollection } = props
  const { t } = useTranslation('common')
  const theme = useTheme()
  const tabAndDesktop = useMediaQuery(theme.breakpoints.up('sm'))

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
    handleClose()
  }

  const handleDeleteQuote = () => {
    handleClose()
  }

  const quotes = quoteGetters.getQuotes(quoteCollection)

  const columns = tabAndDesktop ? desktopColumns : mobileColumns

  return (
    <>
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
