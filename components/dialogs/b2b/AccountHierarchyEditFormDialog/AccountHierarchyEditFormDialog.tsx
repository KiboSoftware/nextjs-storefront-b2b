import { useTranslation } from 'next-i18next'

import { AccountHierarchyEditForm } from '@/components/b2b'
import { KiboDialog } from '@/components/common'
import { UpdateCustomerB2bAccountParams } from '@/lib/types'

import { B2BAccount } from '@/lib/gql/types'

interface AccountHierarchyEditFormDialogProps {
  accounts: B2BAccount[]
  accountToEdit: B2BAccount
  formTitle?: string
  onSave: (data: UpdateCustomerB2bAccountParams) => void
  onClose: () => void
}

const AccountHierarchyEditFormDialog = (props: AccountHierarchyEditFormDialogProps) => {
  const { t } = useTranslation('common')
  const { accounts, accountToEdit, formTitle = t('edit-child-account'), onSave, onClose } = props

  return (
    <KiboDialog
      showCloseButton
      Title={formTitle}
      showContentTopDivider={false}
      showContentBottomDivider={false}
      Actions={''}
      Content={
        <AccountHierarchyEditForm
          accounts={accounts}
          accountToEdit={accountToEdit}
          onSave={onSave}
          onClose={onClose}
        />
      }
      customMaxWidth="45rem"
      onClose={onClose}
    />
  )
}

export default AccountHierarchyEditFormDialog
