import { B2BAccount } from '../gql/types'

export interface AccountHierarchyNode {
  id: number
  children: AccountHierarchyNode[]
}

export interface B2BAccountHierarchyResult {
  accounts: B2BAccount[]
  hierarchy: AccountHierarchyNode
}

export interface AddChildAccountProps {
  isAddingAccountToChild: boolean
  accounts: any[]
}

export interface CreateCustomerB2bAccountParams {
  parentAccount?: B2BAccount
  companyOrOrganization: string
  taxId?: string
  firstName: string
  lastName: string
  emailAddress: string
}

export interface EditChildAccountProps {
  accounts: any[]
  b2BAccount: B2BAccount
}
export interface UpdateCustomerB2bAccountParams {
  parentAccount?: B2BAccount
}

export interface AccountHierarchyResultType {
  b2BAccountHierarchy?: B2BAccountHierarchyResult
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

export interface HierarchyNode {
  id: number
  children?: HierarchyNode[]
}

export interface NestableOnChangeArgs {
  dragItem: HierarchyNode
  items: HierarchyNode[]
  targetPath: number[]
}
