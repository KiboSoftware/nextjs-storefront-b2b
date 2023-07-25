import { useTranslation } from 'next-i18next'

import { KiboDialog } from '@/components/common'
import { AccountHierarchyForm } from '@/components/my-account'

import { CustomerAccount } from '@/lib/gql/types'

interface AccountHierarchyFormDialogProps {
  user: CustomerAccount
  formTitle?: string
  onSave: (data: any) => void
  onClose: () => void
}

const AccountHierarchyFormDialog = (props: AccountHierarchyFormDialogProps) => {
  const { t } = useTranslation('common')
  const { user, formTitle = t('add-child-account'), onSave, onClose } = props

  return (
    <KiboDialog
      showCloseButton
      Title={formTitle}
      showContentTopDivider={false}
      showContentBottomDivider={false}
      Actions={''}
      Content={<AccountHierarchyForm user={user} onSave={onSave} onClose={onClose} />}
      customMaxWidth="55rem"
      onClose={onClose}
    />
  )
}

export default AccountHierarchyFormDialog
