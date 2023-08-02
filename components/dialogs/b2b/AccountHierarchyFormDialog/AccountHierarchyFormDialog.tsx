import { useTranslation } from 'next-i18next'

import { AccountHierarchyForm } from '@/components/b2b'
import { KiboDialog } from '@/components/common'
import { CreateCustomerB2bAccountParams } from '@/lib/types'

import { B2BAccount, CustomerAccount } from '@/lib/gql/types'

interface AccountHierarchyFormDialogProps {
  accounts?: CustomerAccount[]
  isAddingAccountToChild: boolean
  accountToEdit?: B2BAccount
  formTitle?: string
  onSave: (data: CreateCustomerB2bAccountParams) => void
  onClose: () => void
}

const AccountHierarchyFormDialog = (props: AccountHierarchyFormDialogProps) => {
  const { t } = useTranslation('common')
  const {
    accounts,
    isAddingAccountToChild,
    accountToEdit,
    formTitle = t('add-child-account'),
    onSave,
    onClose,
  } = props

  return (
    <KiboDialog
      showCloseButton
      Title={formTitle}
      showContentTopDivider={false}
      showContentBottomDivider={false}
      Actions={''}
      Content={
        <AccountHierarchyForm
          accounts={accounts}
          isAddingAccountToChild={isAddingAccountToChild}
          accountToEdit={accountToEdit}
          onSave={onSave}
          onClose={onClose}
        />
      }
      customMaxWidth="55rem"
      onClose={onClose}
    />
  )
}

export default AccountHierarchyFormDialog
