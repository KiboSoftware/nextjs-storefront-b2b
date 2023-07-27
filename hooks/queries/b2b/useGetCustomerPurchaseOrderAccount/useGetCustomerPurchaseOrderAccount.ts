/**
 * @module useGetCustomerPurchaseOrderAccount
 */
import { useQuery } from '@tanstack/react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { getCustomerPurchaseOrderQuery } from '@/lib/gql/queries'
import { customerPurchaseOrderAccountKeys } from '@/lib/react-query/queryKeys'

/**
 * @hidden
 */
export interface UseCustomerPurchaseOrderAccountResponse {
  data: any
  isLoading: boolean
  isSuccess: boolean
}

const loadCustomerCustomerPurchaseOrderAccount = async (accountId: number) => {
  const client = makeGraphQLClient()

  const response = await client.request({
    document: getCustomerPurchaseOrderQuery,
    variables: { accountId },
  })
  return response?.customerPurchaseOrderAccount
}

export const useGetCustomerPurchaseOrderAccount = (
  accountId: number
): UseCustomerPurchaseOrderAccountResponse => {
  const {
    data = {},
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: customerPurchaseOrderAccountKeys?.purchaseOrderAccountById(accountId),
    queryFn: () => loadCustomerCustomerPurchaseOrderAccount(accountId),
    enabled: !!accountId,
    refetchOnWindowFocus: false,
  })

  return { data, isLoading, isSuccess }
}
