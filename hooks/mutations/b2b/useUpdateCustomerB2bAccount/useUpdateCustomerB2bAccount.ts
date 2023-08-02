/**
 * @module useUpdateCustomerB2bAccountMutation
 */
import { useMutation } from '@tanstack/react-query'

import { makeGraphQLClient } from '@/lib/gql/client'

import { MutationUpdateCustomerB2bAccountArgs } from '@/lib/gql/types'
import { updateCustomerB2bAccountMutation } from '@/lib/gql/mutations'

const client = makeGraphQLClient()

interface UpdateCustomerB2bAccountArgs {
  accountId: number
  b2BAccountInput: MutationUpdateCustomerB2bAccountArgs
}

const updateCustomerB2bAccount = async ({
  accountId,
  b2BAccountInput,
}: UpdateCustomerB2bAccountArgs) => {
  const response = await client.request({
    document: updateCustomerB2bAccountMutation,
    variables: { accountId, b2BAccountInput },
  })
  return response?.updateCustomerB2bAccount
}

/**
 * [Mutation hook] useUpdateCustomerB2bAccountMutation uses the graphQL mutation
 *
 * <b>updateCustomerB2bAccountUser(b2BAccountInput: b2BAccountInput): B2BUser</b>
 *
 * Description : Updates account in hierarchy
 *
 * Parameters passed to function updateCustomerB2bAccount(b2BAccountInput: B2BAccountInput) => expects object of type 'B2BAccountInput' containing accountId and input
 *
 * On success, calls refetchQueries on customerB2BUserKeys and fetches account hierarchy.
 *
 * @returns 'response?.data?.updateCustomerB2bAccount' which contains object of account added
 */

export const useUpdateCustomerB2bAccountMutation = () => {
  return {
    updateCustomerB2bAccount: useMutation({
      mutationFn: updateCustomerB2bAccount,
    }),
  }
}
