import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CreateWishlist from './createWishlist'
import * as stories from './CreateWishlist.stories'
import { renderWithQueryClient } from '../../../__test__/utils/renderWithQueryClient'

const mockFunction = jest.fn()

const { CreateWishlistComponent } = composeStories(stories)

function setup() {
  const user = userEvent.setup()

  renderWithQueryClient(<CreateWishlist handleCreateWishlist={mockFunction} />)
  return { user }
}
describe('[component] - Wishlist', () => {
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
  it('should change new list name input', async () => {
    const userEnteredText = 'New List'
    const { user } = setup()
    const newListNameInput = await screen.findByPlaceholderText('Name this list')
    await user.type(newListNameInput, userEnteredText)
    await waitFor(() => {
      expect(newListNameInput).toHaveValue(userEnteredText)
    })
  })

  it.only('should close form', async () => {
    const { user } = setup()
    const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
    // const heading = await screen.findByRole('heading')
    // cancelButton.addEventListener('click', mockFunction)
    // screen.debug()
    await user.click(cancelButton)
    expect(mockFunction).toBeCalled()
  })
})
