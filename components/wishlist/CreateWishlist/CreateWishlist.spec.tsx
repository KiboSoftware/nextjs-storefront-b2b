import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './CreateWishlist.stories'

const mockFunction = jest.fn()

const { CreateWishlistComponent } = composeStories(stories)
function setup() {
  const user = userEvent.setup()
  render(<CreateWishlistComponent handleCreateWishlist={mockFunction} />)
  return { user }
}
describe('[component] - CreateWishlist', () => {
  it('should render form', async () => {
    setup()
    const heading = await screen.findByRole('heading')
    const newListNameInput = await screen.findByPlaceholderText('Name this list')
    const productSearchInput = await screen.findByPlaceholderText('Search by product name or code')
    const saveButton = await screen.findByRole('button', { name: 'Save & Close' })
    const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
    expect(heading).toBeVisible()
    expect(newListNameInput).toBeVisible()
    expect(productSearchInput).toBeVisible()
    expect(saveButton).toBeVisible()
    expect(cancelButton).toBeVisible()
  })

  it.only('should close form', async () => {
    const { user } = setup()
    const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
    // const heading = await screen.findByRole('heading')
    // cancelButton.addEventListener('click', mockFunction)
    await user.click(cancelButton)
    expect(mockFunction).toBeCalled()
  })
})
