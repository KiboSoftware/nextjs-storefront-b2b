import React, { MouseEvent, MouseEventHandler, useState } from 'react'

import { Delete, Edit, FolderCopySharp, MoreVert } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { CrWishlist, Maybe } from '@/lib/gql/types'

const tableCellStyles = {
  padding: '5px 10px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const IconButtonStyles = {
  fontWeight: '400',
  lineHeight: '19px',
  fontSize: '16px',
  color: '#000000',
  textDecoration: 'underline',
  '&:hover': {
    textDecoration: 'underline',
    background: '#fff',
  },
}

interface ListItemOptionsProps {
  id: Maybe<string> | undefined
  onEditList: (param: Maybe<string>) => void
  onCopyList: (param: Maybe<string>) => void
  onDeleteList: (param: Maybe<string>) => void
}

const ListItemOptions = (props: ListItemOptionsProps) => {
  const { id, onEditList, onCopyList, onDeleteList } = props
  const theme = useTheme()
  const mdScreen = useMediaQuery<boolean>(theme.breakpoints.up('md'))
  const { t } = useTranslation('common')
  const options = [
    { name: 'Edit', onClick: onEditList },
    { name: 'Add to cart', onClick: () => console.log('Work in progress') },
    { name: 'Initiate Quote', onClick: () => console.log('Work in progress') },
    { name: 'Duplicate', onClick: (id: any) => onCopyList(id) },
    { name: 'Delete', onClick: (id: any) => onDeleteList(id) },
  ]
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  if (!mdScreen)
    return (
      <>
        <IconButton
          style={{ padding: '0px' }}
          onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
        >
          <MoreVert />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {/* {options.map((o, i) => (
            <MenuItem
              key={id || i}
              id={id}
              onClick={o.onClick}
              style={i !== options.length - 1 ? { borderBottom: '0.5px solid #EAEAEA' } : {}}
            >
              <span>{o.name}</span>
            </MenuItem>
          ))} */}
        </Menu>
      </>
    )
  return (
    <Box style={{ justifyContent: 'flex-end', display: 'flex' }}>
      <Button sx={IconButtonStyles}>{t('initiate-quote')}</Button>
      <Button sx={IconButtonStyles}>{t('add-to-cart')}</Button>
      <IconButton sx={IconButtonStyles}>
        <Edit />
      </IconButton>
      <IconButton sx={IconButtonStyles}>
        <FolderCopySharp />
      </IconButton>
      <IconButton sx={IconButtonStyles}>
        <Delete />
      </IconButton>
    </Box>
  )
}

interface ListTableProps {
  rows: CrWishlist[]
  isLoading: boolean
  onCopyList: (param: any) => void
  onEditList: (param: any) => void
  onDeleteList: (param: any) => void
}

const ListTable = (props: ListTableProps) => {
  const { rows, isLoading, onCopyList, onDeleteList, onEditList } = props
  const { t } = useTranslation('common')
  const theme = useTheme()
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'))
  return (
    <TableContainer sx={{ opacity: isLoading ? '0.5' : '1' }}>
      <Table style={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow style={{ backgroundColor: '#f7f7f7', padding: '10px 0' }}>
            <TableCell style={{ padding: '10px 10px', width: mdScreen ? '25%' : '50%' }}>
              {t('list-name')}
            </TableCell>
            <TableCell style={{ padding: '10px 10px', width: mdScreen ? '15%' : '30%' }}>
              {t('date-created')}
            </TableCell>
            {mdScreen && (
              <TableCell style={{ padding: '10px 10px', width: '20%' }}>
                {t('created-by')}
              </TableCell>
            )}
            <TableCell
              style={{ padding: '10px 10px', width: mdScreen ? '25%' : '10%' }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((item: CrWishlist) => {
            return (
              <TableRow key={item.id}>
                <TableCell style={{ ...tableCellStyles, width: mdScreen ? '25%' : '50%' }}>
                  {mdScreen ? (
                    item.name
                  ) : (
                    <Box>
                      {item.name}
                      <br />
                      <p style={{ margin: '5px 0', color: '#cdcdcd' }}>
                        {item.auditInfo?.createBy}
                      </p>
                    </Box>
                  )}
                </TableCell>
                <TableCell style={{ ...tableCellStyles, width: mdScreen ? '15%' : '30%' }}>
                  {item.auditInfo?.createDate}
                </TableCell>
                {mdScreen ? (
                  <TableCell style={{ ...tableCellStyles, width: '20%' }}>
                    {item.auditInfo?.createBy}
                  </TableCell>
                ) : (
                  <></>
                )}
                <TableCell style={{ ...tableCellStyles, width: mdScreen ? '25%' : '10%' }}>
                  <ListItemOptions
                    id={item.id}
                    onEditList={onEditList}
                    onCopyList={onCopyList}
                    onDeleteList={onDeleteList}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ListTable