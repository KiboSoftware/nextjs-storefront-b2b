/**
 * @module useCreateQuote
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { createQuoteMutation } from '@/lib/gql/mutations'
import { buildCreateQuoteParams } from '@/lib/helpers'
import { quoteKeys } from '@/lib/react-query/queryKeys'

/**
 * @hidden
 */

interface CreateQuoteProps {
  siteId: number
  tenantId: number
  customerAccountId: number
}
const createQuote = async (props: CreateQuoteProps) => {
  const client = makeGraphQLClient()
  const { siteId, tenantId, customerAccountId } = props

  const variables = buildCreateQuoteParams(siteId, tenantId, customerAccountId)

  const response = await client.request({
    document: createQuoteMutation,
    variables,
  })

  return response?.createQuote
}
/**
 * [Mutation hook] useCreateQuote uses the graphQL mutation
 *
 * <b>createQuote($quoteInput: QuoteInput): Quote</b>
 *
 * Description : create a quote
 *
 * Parameters passed to function createQuote(props: CreateQuoteProps) => expects object of type 'CreateQuoteProps' containing siteId, tenantId, customerAccountId
 *
 * On success, calls invalidateQueries on quoteKeys and fetches the updated result.
 *
 * @returns 'response?.createQuote' which contains object of quote created
 */
export const useCreateQuote = () => {
  const queryClient = useQueryClient()
  return {
    createQuote: useMutation({
      mutationFn: createQuote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: quoteKeys.all })
      },
    }),
  }
}
