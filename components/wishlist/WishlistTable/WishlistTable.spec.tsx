import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './WishlistTable.stories'

const { WishlistTableComponent } = composeStories(stories)
function setup() {
  const user = userEvent.setup()
  render(<WishlistTableComponent />)
  return { user }
}
describe('[component] - Wishlist', () => {
  it('should render table', () => {
    setup()
    // checking for table
    const list = screen.getByRole('grid')
    // checking for pagination
    const pagination = screen.getByRole('navigation')
    expect(list).toBeVisible()
    expect(pagination).toBeVisible()
  })
  it.only('should open alert', async () => {
    const { user } = setup()
    console.log(screen)
    const buttons = screen.queryAllByTestId('initiate-quote')
    // buttons.forEach((b, i) => console.log(i, '==>', b))
    console.log(buttons)
  })
})
