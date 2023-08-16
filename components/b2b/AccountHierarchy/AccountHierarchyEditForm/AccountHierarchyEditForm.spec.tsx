import '@testing-library/jest-dom'
import { composeStories } from '@storybook/testing-react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './AccountHierarchyEditForm.stories' // import all stories from the stories file
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

    const parentAccountField: HTMLInputElement = screen.getByRole('textbox', { name: '' })
    const submitButton = await screen.findByTestId('submit-button')
    const cancelButton = await screen.findByTestId('cancel-button')

    expect(parentAccountField).toBeInTheDocument()
    await waitFor(() =>
      expect(parseInt(parentAccountField.value)).toBe(Common?.args?.accounts?.[0]?.id)
    )
    expect(submitButton).toBeVisible()
    expect(cancelButton).toBeVisible()
  })

  it('should call onSave callback function when user clicks on Create Account button', async () => {
    const user = userEvent.setup()

    render(<Common {...Common.args} onSave={onSave} onClose={onClose} />)

    const submitButton = await screen.findByTestId('submit-button')

    user.click(submitButton)
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1))
  })

  it('should call onClose callback function when user clicks on Cancel button', async () => {
    const user = userEvent.setup()

    render(<Common {...Common.args} onSave={onSave} onClose={onClose} />)

    const cancelButton = await screen.findByTestId('cancel-button')
    user.click(cancelButton)
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })
})
