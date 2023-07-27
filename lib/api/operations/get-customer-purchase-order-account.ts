import { NextApiRequest } from 'next'

import { getAdditionalHeader } from '../util'
import { fetcher } from '@/lib/api/util'
import { getCustomerPurchaseOrderQuery } from '@/lib/gql/queries'

export default async function getCustomerPurchaseOrderAccount(userId: string, req: NextApiRequest) {
  const variables = { accountId: userId }

  const headers = req ? getAdditionalHeader(req) : {}

  const response = await fetcher(
    { query: getCustomerPurchaseOrderQuery, variables: variables },
    { headers }
  )
  return response?.data?.customerPurchaseOrderAccount
}
