/**
 * @module useUpdateCustomerB2bUserMutation
 */

import { useMutation } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'

import { B2BUserInput } from '@/lib/gql/types'
import { updateCustomerB2bUserMutation } from '@/lib/gql/mutations'

const client = makeGraphQLClient()

const updateCustomerB2bUser = async (b2BUserInput: B2BUserInput) => {
  const response = await client.request({
    document: updateCustomerB2bUserMutation,
    variables: b2BUserInput,
  })
  return response?.account
}

/**
 * [Mutation hook] useUpdateCustomerB2bUserMutation uses the graphQL mutation
 *
 * <b>updateCustomerB2bAccountUser(accountId: Int!, userId: Int!, b2BUserInput: b2BUserInput): B2BUser</b>
 *
 * Description : Updates customer B2B user
 *
 * Parameters passed to function updateCustomerB2bUser(b2BUserInput: B2BUserInput) => expects object of type 'B2BUserInput' containing accountId, userId and b2bUserInput
 *
 * On success, calls refetchQueries on customerB2BUserKeys and fetches B2B users list.
 *
 * @returns 'response?.account' which contains object of user updated
 */

export const useUpdateCustomerB2bUserMutation = () => {
  const {
    mutate,
    mutateAsync,
    data = {},
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: updateCustomerB2bUser,
    onMutate: () => {},
    retry: 0,
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
