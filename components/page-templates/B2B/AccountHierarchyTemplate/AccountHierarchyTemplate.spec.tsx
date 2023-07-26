/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'

import '@testing-library/jest-dom'
import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './AccountHierarchyTemplate.stories' // import all stories from the stories file
import { createQueryClientWrapper } from '@/__test__/utils'
import { ModalContextProvider } from '@/context'
import { CreateCustomerB2bAccountParams } from '@/lib/types'

import { CustomerAccount } from '@/lib/gql/types'

const { Common } = composeStories(stories)

interface AccountHierarchyDialogProps {
  formTitle?: string
  user?: CustomerAccount
  onSave: (data: CreateCustomerB2bAccountParams) => void
  onClose: () => void
}

// Mock
const onCloseMock = jest.fn()

const AccountHierarchyMock = ({ onClose }: { onClose: () => void }) => (
  <div data-testid="user-form-mock">
    <button data-testid="cancel-account-mock-button" onClick={onClose}>
      Cancel
    </button>
    <button data-testid="save-account-mock-button" onClick={onClose}>
      Save
    </button>
  </div>
)
jest.mock(
  '@/components/my-account/AccountHierarchy/AccountHierarchyForm/AccountHierarchyForm',
  () => () => AccountHierarchyMock({ onClose: onCloseMock })
)

jest.mock('@/components/dialogs', () => ({
  __esModule: true,
  AccountHierarchyDialog: (props: AccountHierarchyDialogProps) => {
    const params = {
      parentAccount: { id: 1023, companyOrOrganization: 'Parent Account' },
      companyOrOrganization: 'ABCD',
      taxId: '123234',
      firstName: 'Karan',
      lastName: 'Thappar',
      emailAddress: 'karan@gmail.com',
    }

    return (
      <div>
        <h1>user-form-dialog</h1>
        <button onClick={() => props.onSave(params)}>Confirm</button>
      </div>
    )
  },
}))

const setup = () => {
  const user = userEvent.setup()
  render(
    <ModalContextProvider>
      <Common />
    </ModalContextProvider>,
    {
      wrapper: createQueryClientWrapper(),
    }
  )
  return {
    user,
  }
}

describe('[component] - AccountHierarchyTemplate', () => {
  it('should render component', async () => {
    jest.mock('@/hooks', () => ({
      useGetB2BUserQueries: jest.fn().mockReturnValue({
        data: { id: 1023 },
        isLoading: false,
      }),
    }))

    render(<Common />, {
      wrapper: createQueryClientWrapper(),
    })

    const heading = screen.getByText('account-hierarchy')
    expect(heading).toBeVisible()

    const addUserButton = screen.getByText('add-child-account')
    expect(addUserButton).toBeVisible()
  })

  it('should open add child account form in dialog when add child account button clicked', async () => {
    const { user } = setup()

    const addChildAccountButton = screen.getByText('add-child-account')
    user.click(addChildAccountButton)
  })
})
