/**
 * @module useGetWishlist
 */
import { useQuery } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { getWishlistQuery } from '@/lib/gql/queries'
import { wishlistKeys } from '@/lib/react-query/queryKeys'

import type { CrWishlist } from '@/lib/gql/types'

/**
 * @hidden
 */
export interface UseWishlistResponse {
  data?: CrWishlist
  isLoading: boolean
  isSuccess: boolean
  isFetching: boolean
}

const getWishlists = async (): Promise<CrWishlist> => {
  const client = makeGraphQLClient()
  const response = await client.request({
    document: getWishlistQuery,
    variables: {},
  })

  return response?.wishlists?.items[0]
}

const getAllWishlists = async (props: any): Promise<CrWishlist> => {
  const client = makeGraphQLClient()
  const response = await client.request({
    document: getWishlistQuery,
    variables: {
      sortBy: props.sortBy || '',
      startIndex: props.startIndex || 0,
      pageSize: props.pageSize || 5,
      filter: props.filter || '',
    },
  })

  return response?.wishlists
}

/**
 * [Query hook] useGetWishlist uses the graphQL query
 *
 * <b>wishlists(startIndex: Int, pageSize: Int, sortBy: String, filter: String): WishlistCollection</b>
 *
 * Description : Fetches the all wishlists for logged in user. To authenticate the user, request header taking token from the cookie.
 *
 * Parameters passed to function getWishlists()
 *
 * On success, returns the first item of wishlists as it will always have single item with respect to customer account id.
 *
 * @returns 'response?.wishlists?.items[0], which contains the first wishlist item'
 */

export const useGetWishlist = (): UseWishlistResponse => {
  const { data, isLoading, isSuccess, isFetching } = useQuery(wishlistKeys.all, getWishlists, {
    refetchOnWindowFocus: false,
  })

  return { data, isLoading, isSuccess, isFetching }
}

export const useAllWishlistsQueries = (props: any): any => {
  const { data, isLoading, isSuccess, isFetching, refetch } = useQuery(
    wishlistKeys.all.concat(props.startIndex),
    () => getAllWishlists(props),
    {
      refetchOnWindowFocus: false,
      // enabled: props.pageSize && props.sortBy && props.startIndex ? true : false
    }
  )

  return { data, isLoading, isSuccess, isFetching }
}
