import { composeStories } from '@storybook/testing-react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './AccountHierarchyFormDialog.stories'
import { b2BAccountHierarchyResult } from '@/__mocks__/stories'
import { ModalContextProvider } from '@/context'

const { Common } = composeStories(stories)
const user = userEvent.setup()

describe('[components]  AccountHierarchyFormDialog Dialog', () => {
  const onSaveMock = jest.fn()
  const onCloseMock = jest.fn()

  const setup = () => {
    render(
      <Common
        {...Common.args}
        accounts={b2BAccountHierarchyResult.accounts}
        isAddingAccountToChild={false}
        onSave={onSaveMock}
        onClose={onCloseMock}
      />,
      {
        wrapper: ModalContextProvider,
      }
    )

    return {
      onSaveMock,
      onCloseMock,
    }
  }

  it('should render component', async () => {
    render(<Common {...Common.args} formTitle="Add child account" />)

    const accountHierarchyFromDialogComponent = screen.getByTestId('account-hierarchy-form')
    expect(accountHierarchyFromDialogComponent).toBeVisible()

    const titleElement = screen.getByText('Add child account')
    expect(titleElement).toBeVisible()
  })

  it('should render save and cancel text on button when isUserFormInDialog is true', () => {
    render(<Common {...Common.args} />)

    const cancelText = screen.getByText('cancel')
    expect(cancelText).toBeVisible()

    const saveText = screen.getByText('create-account')
    expect(saveText).toBeVisible()
  })

  it('should call callback function when user clicks on Create Account button', async () => {
    const { onSaveMock } = setup()

    const createAccountButton = await screen.findByRole('button', {
      name: /create-account/i,
    })
    expect(createAccountButton).toBeVisible()
    expect(createAccountButton).toBeEnabled()

    const parentAccountSelect = await screen.findByRole('button', { name: 'parent-account' })
    const companyNameField: HTMLInputElement = await screen.findByRole('textbox', {
      name: 'company-name',
    })
    const taxIdField: HTMLInputElement = await screen.findByRole('textbox', {
      name: 'tax-id (optional)',
    })
    const firstNameField: HTMLInputElement = await screen.findByRole('textbox', {
      name: 'first-name',
    })
    const lastNameField: HTMLInputElement = await screen.findByRole('textbox', {
      name: 'last-name-or-sur-name',
    })
    const emailField: HTMLInputElement = await screen.findByRole('textbox', { name: 'email' })

    fireEvent.mouseDown(parentAccountSelect)
    const optionsPopupEl = await screen.findByRole('listbox')
    console.log(optionsPopupEl)
    // await user.click(await within(optionsPopupEl).findByRole('option', { name: 'ABC Enterprise' }))

    userEvent.type(companyNameField, 'ABC Comp')
    await waitFor(() => expect(companyNameField.value).toBe('ABC Comp'))

    userEvent.type(taxIdField, '123456')
    await waitFor(() => expect(taxIdField.value).toBe('123456'))

    userEvent.type(firstNameField, 'Ayush')
    await waitFor(() => expect(firstNameField.value).toBe('Ayush'))

    userEvent.type(lastNameField, 'Gupta')
    await waitFor(() => expect(lastNameField.value).toBe('Gupta'))

    userEvent.type(emailField, 'ayush.g@gmail.com')
    await waitFor(() => expect(emailField.value).toBe('ayush.g@gmail.com'))

    userEvent.click(createAccountButton)

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledTimes(1)
    })
  })

  it('should close modal when user clicks on Cancel button', async () => {
    const { onCloseMock } = setup()

    const cancelButton = screen.getByRole('button', {
      name: /cancel/i,
    })
    expect(cancelButton).toBeVisible()
    user.click(cancelButton)

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1)
    })
  })
})
