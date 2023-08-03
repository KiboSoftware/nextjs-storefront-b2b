/**
 * @module useGetCustomerPurchaseOrderAccount
 */
import { useQuery } from '@tanstack/react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { getCustomerPurchaseOrderQuery } from '@/lib/gql/queries'
import { customerPurchaseOrderAccountKeys } from '@/lib/react-query/queryKeys'

import { CustomerPurchaseOrderAccount } from '@/lib/gql/types'

/**
 * @hidden
 */
export interface UseCustomerPurchaseOrderAccountResponse {
  data?: CustomerPurchaseOrderAccount
  isLoading: boolean
  isSuccess: boolean
}

const loadCustomerCustomerPurchaseOrderAccount = async (
  accountId: number
): Promise<CustomerPurchaseOrderAccount> => {
  const client = makeGraphQLClient()

  const response = await client.request({
    document: getCustomerPurchaseOrderQuery,
    variables: { accountId },
  })

  console.log('response', response)
  return response?.customerPurchaseOrderAccount
}

export const useGetCustomerPurchaseOrderAccount = (
  accountId: number
): UseCustomerPurchaseOrderAccountResponse => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: customerPurchaseOrderAccountKeys?.purchaseOrderAccountById(accountId),
    queryFn: () => loadCustomerCustomerPurchaseOrderAccount(accountId),
    enabled: !!accountId,
    refetchOnWindowFocus: false,
  })

  console.log('data', data)
  return { data, isLoading, isSuccess }
}
