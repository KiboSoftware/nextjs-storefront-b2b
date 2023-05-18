/**
 * @module useDeleteCustomerB2bUserMutation
 */
import { useMutation, useQueryClient } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { customerB2BUserKeys } from '@/lib/react-query/queryKeys'

import { B2BUserInput } from '@/lib/gql/types'
import { removeCustomerB2bUserMutation } from '@/lib/gql/mutations'

const client = makeGraphQLClient()

const deleteCustomerB2bUser = async (b2BUserInput: B2BUserInput) => {
  const response = await client.request({
    document: removeCustomerB2bUserMutation,
    variables: b2BUserInput,
  })
  return response
}

/**
 * [Mutation hook] useDeleteCustomerB2bUserMutation uses the graphQL mutation
 *
 * <b>removeCustomerB2bAccountUser(accountId: Int!, userId: String!): Boolean</b>
 *
 * Description : Removes customer B2B user from list
 *
 * Parameters passed to function deleteCustomerB2bUser(b2BUserInput: B2BUserInput) => expects object of type 'B2BUserInput' containing accountId and userId
 *
 * On success, calls refetchQueries on customerB2BUserKeys and fetches B2B users list.
 *
 * @returns 'response?.removeCustomerB2bAccountUser' which is a boolean
 */

export const useDeleteCustomerB2bUserMutation = () => {
  const queryClient = useQueryClient()
  const {
    mutate,
    mutateAsync,
    data = {},
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: deleteCustomerB2bUser,
    retry: 0,
    onSuccess: (data) => {
      if (data && data?.removeCustomerB2bAccountUser)
        queryClient.refetchQueries(customerB2BUserKeys.users)
    },
  })

  return {
    mutate,
    mutateAsync,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  }
}
