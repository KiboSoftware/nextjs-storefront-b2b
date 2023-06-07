import { useEffect, useState } from 'react'

import { ChevronLeft, AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  Grid,
  Link,
  Theme,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'
import { useQueryClient } from 'react-query'

import { ConfirmationDialog } from '@/components/dialogs'
import UserTable from '@/components/my-account/User/UserTable/UserTable'
import { useAuthContext, useCustomerB2bUserContext, useModalContext } from '@/context'
import { useGetB2BUserQueries, useDebounce } from '@/hooks'
import { customerB2BUserKeys } from '@/lib/react-query/queryKeys'

import type { NextPage } from 'next'

const BackButtonLink = styled(Link)(({ theme }: { theme: Theme }) => ({
  typography: 'body2',
  textDecoration: 'none',
  color: theme.palette.grey[900],
  display: 'flex',
  alignItems: 'center',
  padding: '1rem 0rem',
  cursor: 'pointer',
}))

const UsersPage: NextPage = () => {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { t } = useTranslation('common')
  const { publicRuntimeConfig } = getConfig()
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'))
  const [isAddUserFormOpen, setAddUserFormState] = useState<boolean>(false)

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debounceTerm, setDebounceTerm] = useState<string>('')
  const debounceSearchTerm = useDebounce(searchTerm, publicRuntimeConfig.debounceTimeout)
  const [page, setPage] = useState<number>(1)
  const [startIndex, setStartIndex] = useState<number>(
    publicRuntimeConfig.b2bUserListing.startIndex
  )
  const { user } = useAuthContext()
  const { showModal } = useModalContext()
  const { deleteCustomerB2bUser } = useCustomerB2bUserContext()
  const { data, isLoading } = useGetB2BUserQueries({
    b2bAccountId: user?.id,
    pageSize: publicRuntimeConfig.b2bUserListing.pageSize,
    startIndex,
    searchTerm: debounceTerm,
  })

  const totalCount = data?.totalCount || 0
  const pageCount = parseInt(
    (totalCount / publicRuntimeConfig.b2bUserListing.pageSize + 1).toString()
  )

  // For page range
  const indexOfLastRow = page * publicRuntimeConfig.b2bUserListing.pageSize
  const indexOfFirstRow = indexOfLastRow - publicRuntimeConfig.b2bUserListing.pageSize
  const startRange = indexOfFirstRow + 1
  const endRange = Math.min(indexOfLastRow, totalCount) || 0

  useEffect(() => {
    setDebounceTerm(debounceSearchTerm)
    queryClient.removeQueries(customerB2BUserKeys.users)
  }, [debounceSearchTerm])

  useEffect(() => {
    setStartIndex(publicRuntimeConfig.b2bUserListing.pageSize * (page - 1))
    queryClient.removeQueries(customerB2BUserKeys.users)
  }, [page])

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue)
    setStartIndex(0)
  }

  const confirmDelete = (id: any) => {
    showModal({
      Component: ConfirmationDialog,
      props: {
        contentText: t('delete-user-confirmation-text'),
        primaryButtonText: 'Delete',
        onConfirm: () => {
          const accountId = user?.id
          const queryVars = { accountId, userId: id }
          deleteCustomerB2bUser(queryVars)
        },
      },
    })
  }

  const openForm = () => {
    setAddUserFormState(false)
  }

  const closeForm = () => {
    setAddUserFormState(false)
  }

  return (
    <Grid>
      <Grid item style={{ marginTop: '10px', marginBottom: '40px' }}>
        {mdScreen && (
          <BackButtonLink aria-label={t('my-account')} href="/my-account">
            <ChevronLeft />
            <Typography variant="body1">{t('my-account')}</Typography>
          </BackButtonLink>
        )}
        <Box
          sx={{
            display: { md: 'flex', xs: 'block' },
            alignItems: 'center',
            margin: '1rem 0',
          }}
        >
          <Typography
            variant={mdScreen ? 'h1' : 'h2'}
            sx={{ paddingLeft: { md: '0.5rem', xs: 0 } }}
          >
            {t('Users')}
          </Typography>
        </Box>
        <Grid container>
          <Grid item xs={12} md={1.25}>
            <Button
              variant="primary"
              style={{ fontSize: '18px', width: '100%' }}
              disableElevation
              disabled={isAddUserFormOpen}
              id="formOpenButton"
              onClick={openForm}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <AddCircleOutlineIcon style={{ marginRight: '8px', width: '20px' }} />
                <span>{t('add-user')}</span>
              </span>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <UserTable
          b2bUsersList={data?.items}
          totalCount={data?.totalCount}
          count={pageCount}
          startRange={startRange}
          endRange={endRange}
          isLoading={isLoading}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          confirmDelete={confirmDelete}
          setPage={(value) => setPage(value)}
        />
      </Grid>
    </Grid>
  )
}

export default UsersPage
