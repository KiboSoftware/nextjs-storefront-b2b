import '@testing-library/jest-dom'
import { composeStories } from '@storybook/testing-react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './AccountHierarchyForm.stories' // import all stories from the stories file
import { createQueryClientWrapper } from '@/__test__/utils'

const { Common } = composeStories(stories)

const onClose = jest.fn()
const onSave = jest.fn()

const setup = () => {
  const user = userEvent.setup()
  render(<Common {...Common.args} />, {
    wrapper: createQueryClientWrapper(),
  })
  return {
    user,
  }
}
describe('[component] User Form', () => {
  it('should render user form', async () => {
    setup()

    const parentAccountField = screen.getByLabelText('parent-account') as HTMLInputElement
    const companyNameField = screen.getByLabelText('company-name')
    const taxIdField = screen.getByLabelText('tax-id (optional)')
    const emaiAddressField = screen.getByLabelText('email')
    const firstNameField = screen.getByLabelText('first-name')
    const lastNameField = screen.getByLabelText('last-name-or-sur-name')
    const submitButton = await screen.findByTestId('submit-button')
    const cancelButton = await screen.findByTestId('cancel-button')

    expect(parentAccountField).toBeVisible()
    await waitFor(() => expect(parentAccountField.value).toBe('Test Organization'))
    expect(companyNameField).toBeVisible()
    expect(taxIdField).toBeVisible()
    expect(emaiAddressField).toBeVisible()
    expect(firstNameField).toBeVisible()
    expect(lastNameField).toBeVisible()
    expect(submitButton).toBeVisible()
    expect(cancelButton).toBeVisible()
  })

  it('should show values entered by user', async () => {
    const user = userEvent.setup()

    render(<Common {...Common.args} onSave={onSave} onClose={onClose} />)

    const companyNameField = screen.getByLabelText('company-name') as HTMLInputElement
    const taxIdField = screen.getByLabelText('tax-id (optional)') as HTMLInputElement
    const emaiAddressField = screen.getByLabelText('email') as HTMLInputElement
    const firstNameField = screen.getByLabelText('first-name') as HTMLInputElement
    const lastNameField = screen.getByLabelText('last-name-or-sur-name') as HTMLInputElement
    const submitButton = await screen.findByTestId('submit-button')

    user.type(companyNameField, 'ABC Enterprise')
    await waitFor(() => expect(companyNameField.value).toBe('ABC Enterprise'))
    user.type(taxIdField, '123234')
    await waitFor(() => expect(taxIdField.value).toBe('123234'))
    user.type(emaiAddressField, 'aman.shukla@gmail.com')
    await waitFor(() => expect(emaiAddressField.value).toBe('aman.shukla@gmail.com'))
    user.type(firstNameField, 'Aman')
    await waitFor(() => expect(firstNameField.value).toBe('Aman'))
    user.type(lastNameField, 'Shukla')
    await waitFor(() => expect(lastNameField.value).toBe('Shukla'))

    user.click(submitButton)
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1))
  })
})
