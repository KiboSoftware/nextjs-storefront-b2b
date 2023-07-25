import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './AccountHierarchyFormDialog.stories'

const { Common } = composeStories(stories)

describe('[components]  AccountHierarchyFormDialog Dialog', () => {
  const setup = (params = {}) => {
    const user = userEvent.setup()
    render(<Common {...params} />)

    return { user }
  }

  it('should render component', async () => {
    setup({ ...Common.args })

    const accountHierarchyFromDialogComponent = screen.getByTestId('account-hierarchy-form')
    const dialogHeading = screen.getByRole('heading', { name: 'add-child-account' })

    expect(dialogHeading).toBeVisible()
    expect(accountHierarchyFromDialogComponent).toBeVisible()
  })

  it('should render form title passed in props', () => {
    render(<Common {...Common.args} formTitle="Edit child account" />)

    const titleElement = screen.getByText('Edit child account')
    expect(titleElement).toBeVisible()
  })

  it('should render save and cancel text on button when isUserFormInDialog is true', () => {
    render(<Common {...Common.args} />)

    const cancelText = screen.getByText('cancel')
    expect(cancelText).toBeVisible()

    const saveText = screen.getByText('create-account')
    expect(saveText).toBeVisible()
  })
})
