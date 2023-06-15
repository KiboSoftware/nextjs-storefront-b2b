import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import WishlistTable from './WishlistTable'
import * as stories from './WishlistTable.stories'
import { wishlistTableMock } from '@/__mocks__/stories'

const {
  rows,
  hiddenColumns,
  pageCount,
  handleCopyWishlist,
  handleDeleteWishlist,
  handleEditWishlist,
  setPage,
} = wishlistTableMock

const { WishlistTableComponent } = composeStories(stories)

function setup() {
  const user = userEvent.setup()
  render(
    <WishlistTable
      isLoading={true}
      rows={rows}
      hiddenColumns={hiddenColumns}
      pageCount={pageCount}
      handleCopyWishlist={handleCopyWishlist}
      handleDeleteWishlist={handleDeleteWishlist}
      handleEditWishlist={handleEditWishlist}
      setPage={setPage}
    />
  )
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
    const buttons = await screen.findAllByTestId('initiate-quote')
    // buttons.forEach((b, i) => console.log(i, '==>', b))
    console.log(buttons)
  })
})
