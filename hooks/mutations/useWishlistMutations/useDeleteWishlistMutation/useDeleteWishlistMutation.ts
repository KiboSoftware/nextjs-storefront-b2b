/**
 * @module useDeleteWishlistMutation
 */
import { useMutation, useQueryClient } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { deleteWishlistMutation } from '@/lib/gql/mutations'
import { wishlistKeys } from '@/lib/react-query/queryKeys'

const deleteWishlist = async (wishlistId: string) => {
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
 * [Mutation hook] useDeleteWishlistMutation uses the graphQL mutation
 *
 * <b>deleteWishlist(wishlistId: string): Wishlist</b>
 *
 * Description : Deletes the wishlist
 *
 * Parameters passed to function deleteWishlist(wishlistId: string) => expects to delete the wishlist
 *
 * @returns true if wishlist deleted
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
