import { B2BAccount } from '../gql/types'

export interface AddChildAccountProps {
  isAddingAccountToChild: boolean
  accounts: any[]
  accountToEdit?: B2BAccount
}
