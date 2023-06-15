/**
 * @module useGetWishlist
 */
import { QueryClient, useQuery, useQueryClient } from 'react-query'

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

export interface UseAllWishlistsQueriesProps {
  pageSize: any
  startIndex: any
  sortBy: string
  filter: string
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

/**
 * [Query hook] useAllGetWishlist uses the graphQL query
 *
 * Description : Fetches the all wishlists for logged in user. To authenticate the user, request header taking token from the cookie.
 *
 * Parameters passed to function getAllWishlists()
 *
 * On success, returns the first item of wishlists as it will always have single item with respect to customer account id.
 *
 * @returns all the fetched wishlist according to pageNumber, pageSize, filters and sortBy
 */

export const useAllWishlistsQueries = (props: UseAllWishlistsQueriesProps): any => {
  const queryClient = useQueryClient()
  const cachedData = queryClient.getQueryData(wishlistKeys.all.concat(props.startIndex.toString()))
  console.log('cachedData', cachedData)
  const { data, isLoading, isSuccess, isFetching } = useQuery(
    wishlistKeys.all.concat(props.startIndex.toString()),
    () => (cachedData ? cachedData : getAllWishlists(props)),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  )
  // queryClient.prefetchQuery({
  //   queryKey: wishlistKeys.all.concat((props.startIndex + props.pageSize).toString()),
  //   queryFn: () =>
  //     cachedData
  //       ? cachedData
  //       : getAllWishlists({ ...props, startIndex: props.startIndex + props.pageSize }),
  // })
  // prefetching next wishlist page and caching it
  useQuery(
    wishlistKeys.all.concat((props.startIndex + props.pageSize).toString()),
    () =>
      cachedData
        ? cachedData
        : getAllWishlists({ ...props, startIndex: props.startIndex + props.pageSize }),
    {
      refetchOnWindowFocus: false,
    }
  )

  return { data, isLoading, isSuccess, isFetching }
}
