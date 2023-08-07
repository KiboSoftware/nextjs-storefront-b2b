/**
 * @module useGetB2BUserQuery
 */
import { useQuery } from '@tanstack/react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { getQuotes } from '@/lib/gql/queries'
import { b2bQuotesKeys } from '@/lib/react-query/queryKeys'

import type { QueryQuotesArgs } from '@/lib/gql/types'

/**
 * @hidden
 */

const client = makeGraphQLClient()

const fetchQuotes = async (param: QueryQuotesArgs) => {
  const response = await client.request({
    document: getQuotes,
    variables: { ...param },
  })

  return response?.quotes
}

export const useGetQuotes = (param: QueryQuotesArgs) => {
  const { isLoading, isSuccess, isError, error, data } = useQuery({
    queryKey: b2bQuotesKeys.quotesParams(param),
    queryFn: () => fetchQuotes(param),
  })

  return {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
  }
}
