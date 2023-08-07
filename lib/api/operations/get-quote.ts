import { NextApiRequest, NextApiResponse } from 'next'

import { fetcher, getAdditionalHeader, getUserClaimsFromRequest } from '@/lib/api/util'
import { getQuoteByIDQuery as query } from '@/lib/gql/queries'

import type { Quote } from '@/lib/gql/types'

export default async function getQuote(
  quoteId: string,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Quote> {
  const variables = {
    quoteId,
  }
  console.log('get-quote', quoteId)

  const userClaims = await getUserClaimsFromRequest(req, res)

  const headers = getAdditionalHeader(req)
  const response = await fetcher({ query, variables }, { userClaims, headers })
  console.log('respons', response)
  return response.data?.quote
}
