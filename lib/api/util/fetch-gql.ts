import vercelFetch from '@vercel/fetch'

import { apiAuthClient } from './api-auth-client'
import { getGraphqlUrl } from './config-helpers'

const fetch = vercelFetch()

const fetcher = async ({ query, variables }: any, options: any) => {
  const authToken = await apiAuthClient.getAccessToken()
  if (!authToken) {
    console.error('no auth token')
  }
  const response = await fetch(getGraphqlUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'x-vol-user-claims': options?.userClaims,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
  if (!response.ok) {
    console.log(response.status)
  }
  return await response.json()
}
export default fetcher
