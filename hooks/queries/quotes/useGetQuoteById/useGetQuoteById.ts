/**
 * @module useGetQuoteById
 */
import { useQuery } from '@tanstack/react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { getQuoteByIDQuery } from '@/lib/gql/queries'
import { quoteKeys } from '@/lib/react-query/queryKeys'

import type { Quote } from '@/lib/gql/types'
interface UseGetQuoteById {
  quoteId: string
  isMultiShip?: boolean
  initialQuote?: Quote
}

/**
 * @hidden
 */
export interface UseGetQuoteByIdResponse {
  data: Quote | undefined
  isLoading: boolean
  isSuccess: boolean
}

const getQuoteById = async (quoteId: string) => {
  const client = makeGraphQLClient()

  const response = await client.request({
    document: getQuoteByIDQuery,
    variables: { quoteId },
  })
  console.log('getquotebyid', quoteId, response)

  return response?.quote
}

/**
 * [Query hook] useGetQuoteById uses the graphQL query
 *
 * <b>quote(quoteId: String!): Quote</b>
 *
 * Description : Retrieves the details of a quote specified by the quote ID.
 *
 * Parameters passed to function getQuote(quoteId: string) => expects quoteId
 *
 * @returns 'response?.quote' which contains details related to quote page.;
 */
export const useGetQuoteByID = ({
  quoteId,
  initialQuote,
}: UseGetQuoteById): UseGetQuoteByIdResponse => {
  const id = quoteId

  const {
    data = [],
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: quoteKeys.detail(id),
    queryFn: () => getQuoteById(quoteId),
    initialData: initialQuote,
    enabled: !!quoteId,
  })

  return { data, isLoading, isSuccess }
}
