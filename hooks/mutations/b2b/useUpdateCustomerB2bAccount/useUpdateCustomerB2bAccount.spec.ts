import { renderHook, waitFor } from '@testing-library/react'

import { useUpdateCustomerB2bAccountMutation } from './useUpdateCustomerB2bAccount'
import { createQueryClientWrapper } from '@/__test__/utils/renderWithQueryClient'
import { b2BAccountResponseMock } from '@/__mocks__/stories'

describe('[hooks] useUpdateCustomerB2bAccountMutation', () => {
  it('should add account to hierarchy', async () => {
    const { result } = renderHook(() => useUpdateCustomerB2bAccountMutation(), {
      wrapper: createQueryClientWrapper(),
    })

    await waitFor(() => {
      expect(result.current.updateCustomerB2bAccount.data).toStrictEqual(b2BAccountResponseMock)
    })
  })
})
