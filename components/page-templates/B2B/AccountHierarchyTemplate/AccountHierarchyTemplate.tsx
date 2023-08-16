import { useEffect, useState } from 'react'

import { ArrowBackIos, AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material'
import { Box, Button, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { accountHierarchyTemplateStyles } from './AccountHierarchyTemplate.styles'
import { AccountHierarchyTree } from '@/components/b2b'
import {
  AccountHierarchyAddFormDialog,
  AccountHierarchyEditFormDialog,
  ConfirmationDialog,
  ViewAccountDetailsDialog,
} from '@/components/dialogs'
import { useAuthContext, useModalContext } from '@/context'
import {
  useCreateCustomerB2bAccountMutation,
  useGetB2BAccountHierachyQueries,
  useUpdateCustomerB2bAccountMutation,
} from '@/hooks'
import { B2BRoles } from '@/lib/constants'
import {
  buildAccountHierarchy,
  buildCreateCustomerB2bAccountParams,
  buildUpdateCustomerB2bAccountParams,
} from '@/lib/helpers'
import {
  AddChildAccountProps,
  CreateCustomerB2bAccountParams,
  EditChildAccountProps,
  HierarchyNode,
} from '@/lib/types'

import { B2BAccount } from '@/lib/gql/types'

const AccountHierarchyTemplate = () => {
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuthContext()
  const { t } = useTranslation('common')
  const { showModal, closeModal } = useModalContext()
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'))

  const { data } = useGetB2BAccountHierachyQueries(user?.id as number)
  const { createCustomerB2bAccount } = useCreateCustomerB2bAccountMutation()
  const { updateCustomerB2bAccount } = useUpdateCustomerB2bAccountMutation()

  const [accountHierarchy, setAccountHierarchy] = useState<{
    accounts: B2BAccount[]
    hierarchy: HierarchyNode[] | undefined
  }>({
    accounts: [],
    hierarchy: undefined,
  })
  useEffect(() => {
    if (!data) return
    const hierarchy = buildAccountHierarchy(data?.accounts)
    console.log('hierarchy', hierarchy)
    setAccountHierarchy({
      accounts: data?.accounts,
      hierarchy,
    })
  }, [data])

  const onAccountTitleClick = () => {
    router.push('/my-account')
  }

  const handleAddAccountFormSubmit = async (formValues: CreateCustomerB2bAccountParams) => {
    const variables = buildCreateCustomerB2bAccountParams({
      ...formValues,
    })
    const createCustomerB2BAccount = await createCustomerB2bAccount.mutateAsync({
      ...variables,
    })
    if (createCustomerB2BAccount) closeModal()
  }

  const handleEditAccountFormSubmit = async (
    formValues: CreateCustomerB2bAccountParams,
    account: B2BAccount
  ) => {
    console.log(formValues, account)
    const variables = buildUpdateCustomerB2bAccountParams(formValues, account)
    const updateCustomerB2BAccount = await updateCustomerB2bAccount.mutateAsync({
      ...variables,
    })
    if (updateCustomerB2BAccount) closeModal()
  }

  const handleAddAccount = ({ isAddingAccountToChild, accounts }: AddChildAccountProps) => {
    showModal({
      Component: AccountHierarchyAddFormDialog,
      props: {
        accounts,
        isAddingAccountToChild,
        primaryButtonText: t('create-account'),
        onSave: (formValues: CreateCustomerB2bAccountParams) =>
          handleAddAccountFormSubmit(formValues),
        onClose: () => closeModal(),
      },
    })
  }

  const handleEditAccount = ({ accounts, accountToEdit }: EditChildAccountProps) => {
    showModal({
      Component: AccountHierarchyEditFormDialog,
      props: {
        accounts,
        accountToEdit,
        primaryButtonText: t('save'),
        formTitle: t('edit-child-account'),
        onSave: (formValues: CreateCustomerB2bAccountParams) =>
          handleEditAccountFormSubmit(formValues, accountToEdit),
        onClose: () => closeModal(),
      },
    })
  }

  const handleViewAccount = (b2BAccount: B2BAccount) => {
    showModal({
      Component: ViewAccountDetailsDialog,
      props: {
        b2BAccount,
        onClose: () => closeModal(),
      },
    })
  }

  const handleSwapAccount = (b2BAccount: B2BAccount) => {
    showModal({
      Component: ConfirmationDialog,
      props: {
        contentText: t('swap-account-hierarchy-text'),
        primaryButtonText: t('yes-move-anyway'),
        title: t('swap-account-hierarchy'),
        onConfirm: () => console.log('account swapped'),
      },
    })
  }

  const handleDeleteAccount = (b2BAccount: B2BAccount) => {
    showModal({
      Component: ConfirmationDialog,
      props: {
        contentText: t('delete-account-confirm-message'),
        primaryButtonText: t('yes-remove'),
        title: t('confirmation'),
        onConfirm: () => console.log('account deleted'),
      },
    })
  }

  const handleAddChildAccount = () => {
    showModal({
      Component: AccountHierarchyAddFormDialog,
      props: {
        accounts: accountHierarchy.accounts,
        isAddingAccountToChild: false,
        primaryButtonText: t('create-account'),
        title: t('confirmation'),
        onSave: handleAddAccountFormSubmit,
        onClose: () => closeModal(),
      },
    })
  }

  return (
    <>
      <Grid item xs={12}>
        <Stack sx={accountHierarchyTemplateStyles.wrapIcon} direction="row" gap={2}>
          <Box sx={{ display: 'flex' }} onClick={onAccountTitleClick}>
            <ArrowBackIos fontSize="inherit" sx={accountHierarchyTemplateStyles.wrapIcon} />
            {mdScreen && <Typography variant="body2">{t('my-account')}</Typography>}
          </Box>
          {!mdScreen && (
            <Box sx={accountHierarchyTemplateStyles.accountHierarchyTextBox}>
              <Typography variant="h2" sx={accountHierarchyTemplateStyles.accountHierarchyText}>
                {t('account-hierarchy')}
              </Typography>
            </Box>
          )}
        </Stack>
      </Grid>
      {mdScreen && (
        <Grid item xs={12} sm={6}>
          <Box sx={{ paddingTop: { md: '30px' } }}>
            <Typography variant="h1">{t('account-hierarchy')}</Typography>
          </Box>
        </Grid>
      )}
      <Grid container>
        <Grid item xs={12} md={12} sx={{ ...accountHierarchyTemplateStyles.buttonGroupGridStyle }}>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleAddChildAccount}
            disableElevation
            id="formOpenButton"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ width: { xs: '100%', md: 180 } }}
          >
            {t('add-child-account')}
          </Button>
        </Grid>
      </Grid>
      <AccountHierarchyTree
        role={B2BRoles.ADMIN}
        accounts={accountHierarchy.accounts}
        hierarchy={accountHierarchy.hierarchy}
        handleViewAccount={handleViewAccount}
        handleAddAccount={handleAddAccount}
        handleEditAccount={handleEditAccount}
        handleSwapAccount={handleSwapAccount}
        handleDeleteAccount={handleDeleteAccount}
      />
    </>
  )
}

export default AccountHierarchyTemplate
