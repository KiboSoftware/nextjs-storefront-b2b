import React from 'react'

import { Edit as EditIcon, RemoveCircle as RemoveCircleIcon } from '@mui/icons-material'
import { Box, Typography, styled, useMediaQuery, useTheme } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { useTranslation } from 'next-i18next'

import { SearchBar, KiboDataTable, KiboPagination } from '@/components/common'

import { B2BUser } from '@/lib/gql/types'
interface UserTableProps {
  b2bUsersList: B2BUser[] | undefined
  count: number
  startRange: number
  endRange: number
  totalCount: number | undefined
  isLoading: boolean
  searchTerm: string
  handleSearch: (searchText: string) => void
  confirmDelete: (userId: string) => void
  setPage: (value: number) => void
}

interface DataTableColumnProperty {
  sortable: boolean
  filterable: boolean
  headerClassName: string
}

const SearchBoxContainer = styled(Box)({
  marginBottom: '20px',
  width: '100%',
})

const PaginationContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '-3.5rem',
})

const UserStatusCircle = styled('div', {
  shouldForwardProp: (prop) => prop == 'color',
})<{ color: string }>(({ color }) => ({
  height: '12px',
  width: '12px',
  left: 0,
  top: '3.5px',
  borderRadius: '100px',
  marginRight: '8px',
  background: color,
}))

const UserTable = (props: UserTableProps) => {
  const {
    b2bUsersList,
    count,
    startRange,
    endRange,
    totalCount,
    isLoading,
    searchTerm,
    handleSearch,
    confirmDelete,
    setPage,
  } = props
  const { t } = useTranslation('common')
  const theme = useTheme()
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'))
  const dataTableColumnProperty: DataTableColumnProperty = {
    sortable: false,
    filterable: false,
    headerClassName: 'super-app-theme--header',
  }

  const [editUserId, setEditUserId] = React.useState<number | null>(null)

  return (
    <>
      <SearchBoxContainer>
        <SearchBar
          onSearch={handleSearch}
          placeHolder={t('user-search-placeholder')}
          searchTerm={searchTerm}
          showClearButton={true}
        />
      </SearchBoxContainer>
      <KiboDataTable
        columnVisibilityModel={{
          firstName: mdScreen,
          lastName: mdScreen,
          isActive: mdScreen,
        }}
        loading={isLoading}
        columns={[
          {
            field: 'emailAddress',
            headerName: mdScreen ? t('email-address') : t('email'),
            type: 'string',
            flex: mdScreen ? 2 : 1,
            ...dataTableColumnProperty,
          },
          {
            field: 'firstName',
            headerName: t('first-name'),
            type: 'string',
            flex: 1.5,
            ...dataTableColumnProperty,
          },
          {
            field: 'lastName',
            headerName: t('last-name-or-sur-name'),
            type: 'string',
            flex: 1.2,
            ...dataTableColumnProperty,
          },
          {
            field: 'role',
            headerName: t('role'),
            type: 'string',
            flex: mdScreen ? 1.2 : 0.5,
            ...dataTableColumnProperty,
            renderCell: (params: GridRenderCellParams<any>) => (
              <Typography>
                {params.row.roles.length
                  ? params.row.roles.reduce((roleList: string, role: any) => {
                      roleList += `${role.roleName} `
                      return roleList
                    }, '')
                  : 'N/A'}
              </Typography>
            ),
          },
          {
            field: 'isActive',
            headerName: t('status'),
            type: 'string',
            flex: 1,
            ...dataTableColumnProperty,
            renderCell: (params: GridRenderCellParams<any>) => (
              <>
                <UserStatusCircle
                  color={params.row.isActive ? theme.palette.primary.main : theme.palette.grey[600]}
                ></UserStatusCircle>
                {params.row.isActive ? 'Active' : 'Inactive'}
              </>
            ),
          },
          {
            field: ' ',
            headerName: '',
            type: 'string',
            flex: 0.5,
            ...dataTableColumnProperty,
            renderCell: (params: GridRenderCellParams<any>) => (
              <>
                <EditIcon
                  onClick={() => setEditUserId(params?.row?.userId)}
                  style={{ marginRight: '16px', cursor: 'pointer' }}
                />
                <RemoveCircleIcon
                  onClick={() => confirmDelete(params?.row?.userId)}
                  style={{ cursor: 'pointer' }}
                />
              </>
            ),
          },
        ]}
        rows={
          b2bUsersList && [
            ...b2bUsersList.map((list: any) => ({ ...list, id: list?.emailAddress })),
          ]
        }
      />

      <PaginationContainer>
        <KiboPagination
          count={count}
          onChange={setPage}
          size="small"
          sx={{ paddingLeft: '-1.5rem' }}
        />
        <Typography
          sx={{
            textAlign: 'end',
            color: theme.palette.grey[600],
            width: { xs: '10rem', md: '12rem' },
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          {mdScreen && 'Displaying '} {startRange} - {endRange} of {totalCount}
        </Typography>
      </PaginationContainer>
    </>
  )
}

export default UserTable
