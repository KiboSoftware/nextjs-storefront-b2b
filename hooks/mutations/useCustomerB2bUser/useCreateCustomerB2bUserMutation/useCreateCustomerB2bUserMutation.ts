/**
 * @module useCreateCustomerB2bUserMutation
 */
import { useMutation, useQueryClient } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { customerB2BUserKeys } from '@/lib/react-query/queryKeys'

import { B2BUserAndAuthInfoInput } from '@/lib/gql/types'
import { addCustomerB2bUserMutation } from '@/lib/gql/mutations'

const client = makeGraphQLClient()

const createCustomerB2bUser = async (b2BUserAndAuthInfoInput: B2BUserAndAuthInfoInput) => {
  const response = await client.request({
    document: addCustomerB2bUserMutation,
    variables: b2BUserAndAuthInfoInput,
  })
  return response?.account
}

/**
 * [Mutation hook] useCreateCustomerB2bUserMutation uses the graphQL mutation
 *
 * <b>createCustomerB2bAccountUser(accountId: Int!, b2BUserAndAuthInfoInput: b2BUserAndAuthInfoInput): B2BUser</b>
 *
 * Description : Adds customer B2B user
 *
 * Parameters passed to function createCustomerB2bUser(b2BUserAndAuthInfoInput: B2BUserAndAuthInfoInput) => expects object of type 'B2BUserAndAuthInfoInput' containing accountId and input
 *
 * On success, calls refetchQueries on customerB2BUserKeys and fetches B2B users list.
 *
 * @returns 'response?.account' which contains object of user added
 */

export const useCreateCustomerB2bUserMutation = () => {
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
    mutationFn: createCustomerB2bUser,
    onSuccess: () => {
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
