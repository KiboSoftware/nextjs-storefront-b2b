import { ArrowBackIos, AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material'
import { Box, Button, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { accountHierarchyTemplateStyles } from './AccountHierarchyTemplate.styles'
import { accountHierarchy } from '@/__mocks__/stories/accountHierarchy'
import { AccountHierarchyTree } from '@/components/b2b'
import {
  AccountHierarchyFormDialog,
  ConfirmationDialog,
  ViewAccountDetailsDialog,
} from '@/components/dialogs'
import { useAuthContext, useModalContext } from '@/context'
import { useCreateCustomerB2bAccountMutation, useUpdateCustomerB2bAccountMutation } from '@/hooks'
import { B2BRoles } from '@/lib/constants'
import { buildCreateCustomerB2bAccountParams } from '@/lib/helpers'
import { CreateCustomerB2bAccountParams } from '@/lib/types'
import { AddChildAccountProps } from '@/lib/types/AccountHierarchy'

import { B2BAccount, B2BAccountInput, CustomerAccount } from '@/lib/gql/types'

const AccountHierarchyTemplate = () => {
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuthContext()
  const { t } = useTranslation('common')
  const { showModal, closeModal } = useModalContext()
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'))

  const { createCustomerB2bAccount } = useCreateCustomerB2bAccountMutation()
  const { updateCustomerB2bAccount } = useUpdateCustomerB2bAccountMutation()

  const onAccountTitleClick = () => {
    router.push('/my-account')
  }

  const handleFormSubmit = async (
    formValues: CreateCustomerB2bAccountParams,
    accountId?: number
  ) => {
    const variables = buildCreateCustomerB2bAccountParams({ ...formValues, parentAccount: user })
    if (accountId) {
      // const updateCustomerB2BAccount = await updateCustomerB2bAccount.mutateAsync({
      //   ...variables,
      //   accountId: accountId as number
      // })
      // if (updateCustomerB2BAccount) closeModal()
    } else {
      const createCustomerB2BAccount = await createCustomerB2bAccount.mutateAsync({
        ...variables,
      })
      if (createCustomerB2BAccount) closeModal()
    }
  }

  const handleChildAccountFormSubmit = ({
    isAddingAccountToChild,
    accounts,
    accountToEdit,
  }: AddChildAccountProps) => {
    showModal({
      Component: AccountHierarchyFormDialog,
      props: {
        accounts,
        isAddingAccountToChild,
        accountToEdit,
        primaryButtonText: accountToEdit ? t('save') : t('create-account'),
        formTitle: accountToEdit && t('edit-account'),
        title: t('confirmation'),
        onSave: (formValues: CreateCustomerB2bAccountParams) =>
          handleFormSubmit(formValues, accountToEdit?.id),
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
            onClick={() =>
              handleChildAccountFormSubmit({
                isAddingAccountToChild: false,
                accounts: [user],
              })
            }
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
        accounts={accountHierarchy.accounts}
        hierarchy={accountHierarchy.hierarchy}
        role={B2BRoles.ADMIN}
        handleViewAccount={handleViewAccount}
        handleChildAccountFormSubmit={handleChildAccountFormSubmit}
        handleSwapAccount={handleSwapAccount}
        handleDeleteAccount={handleDeleteAccount}
      />
    </>
  )
}

export default AccountHierarchyTemplate
