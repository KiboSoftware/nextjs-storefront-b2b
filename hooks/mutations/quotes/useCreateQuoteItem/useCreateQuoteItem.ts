/**
 * @module useCreateQuoteItem
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import createQuoteItemMutation from '@/lib/gql/mutations/quotes/create-quote-item'
import { buildCreateQuoteItemParams } from '@/lib/helpers'
import { quoteKeys } from '@/lib/react-query/queryKeys'

/**
 * @hidden
 */

const createQuoteItem = async (props: any) => {
  const client = makeGraphQLClient()
  const { quoteId, updateMode, product, quantity } = props

  const variables = buildCreateQuoteItemParams(quoteId, updateMode, product, quantity)

  const response = await client.request({
    document: createQuoteItemMutation,
    variables,
  })

  return response?.createQuoteItem
}
/**
 * [Mutation hook] useCreateQuoteItem uses the graphQL mutation
 *
 * <b>createQuoteItem($quoteId: String!, updateMode: String, $orderItemInput: crOrderItemInput): Quote</b>
 *
 * Description : Add the product items to the cart with selected quantity
 *
 * Parameters passed to function createQuoteItem(props: AddCartItemParams) => expects object of type 'AddCartItemParams' containing product and quantity
 *
 * On success, calls invalidateQueries on cartKeys and fetches the updated result.
 *
 * @returns 'response?.createQuoteItem' which contains object of product items added to cart and it's quantity
 */
export const useCreateQuoteItem = () => {
  const queryClient = useQueryClient()
  return {
    createQuoteItem: useMutation({
      mutationFn: createQuoteItem,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: quoteKeys.all })
      },
    }),
  }
}
