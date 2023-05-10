/**
 * @module useCreateWishlistMutation
 */
import getConfig from 'next/config'
import { useMutation, useQueryClient } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { deleteWishlistMutation } from '@/lib/gql/mutations'
import { wishlistKeys } from '@/lib/react-query/queryKeys'

const deleteWishlist = async (wishlistId: number) => {
  const client = makeGraphQLClient()

  const variables = {
    wishlistId,
  }
  const response = await client.request({
    document: deleteWishlistMutation,
    variables,
  })

  return response
}

/**
 * [Mutation hook] useCreateWishlistMutation uses the graphQL mutation
 *
 * <b>createWishlist(wishlistInput: WishlistInput): Wishlist</b>
 *
 * Description : Creates the wishlist for logged in user
 *
 * Parameters passed to function createWishlist(customerAccountId: number) => expects object containing accountId to create wishlist.
 *
 * On success, calls invalidateQueries on wishlistKeys and fetches the updated result.
 *
 * @returns 'response?.createWishlistItem', which contains wishlist created for user.
 */

export const useDeleteWishlistMutation = () => {
  const queryClient = useQueryClient()

  return {
    deleteWishlist: useMutation(deleteWishlist, {
      onSuccess: () => {
        queryClient.invalidateQueries(wishlistKeys.all)
      },
    }),
  }
}
