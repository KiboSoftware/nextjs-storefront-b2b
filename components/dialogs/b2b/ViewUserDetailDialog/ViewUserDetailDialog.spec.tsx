import { composeStories } from '@storybook/testing-react'
import { fireEvent, render, screen } from '@testing-library/react'

import * as stories from './ViewUserDetailDialog.stories'
import { customerB2BUserForPage0Mock } from '@/__mocks__/stories'
import { ModalContextProvider } from '@/context'

import { B2BUser } from '@/lib/gql/types'

const { Common } = composeStories(stories)

const onCloseMock = jest.fn()

describe('[components]  ViewUserDetailDialog Dialog', () => {
  const b2BUser = customerB2BUserForPage0Mock?.items?.[0] as B2BUser
  const setup = () => {
    render(<Common {...Common.args} b2BUser={b2BUser} onClose={onCloseMock} />, {
      wrapper: ModalContextProvider,
    })

    return {
      onCloseMock,
    }
  }

  it('should render component', async () => {
    render(<Common {...Common.args} formTitle="Buyer Information" />)

    const viewAccountHierarchyHeading = screen.getByText('Buyer Information')
    expect(viewAccountHierarchyHeading).toBeVisible()

    const cancelButton = screen.getByText('cancel')
    expect(cancelButton).toBeVisible()
  })

  it('should close modal when user clicks on Cancel button', async () => {
    const { onCloseMock } = setup()

    const cancelButton = screen.getByText('cancel')
    expect(cancelButton).toBeVisible()

    fireEvent.click(cancelButton)
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
