import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import WishlistTable from './WishlistTable'
import { wishlistTableMock } from '@/__mocks__/stories'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const {
  rows,
  hiddenColumns,
  isLoading,
  pageCount,
  handleCopyWishlist,
  handleDeleteWishlist,
  handleEditWishlist,
  pageOnChange,
} = wishlistTableMock
export default {
  title: 'Wishlist/WishlistTable',
  component: WishlistTable,
} as ComponentMeta<typeof WishlistTable>

export const WishlistTableComponent: ComponentStory<typeof WishlistTable> = (args) => (
  <WishlistTable
    rows={rows}
    hiddenColumns={hiddenColumns}
    isLoading={isLoading}
    pageCount={pageCount}
    handleCopyWishlist={handleCopyWishlist}
    handleDeleteWishlist={handleDeleteWishlist}
    handleEditWishlist={handleEditWishlist}
    pageOnChange={pageOnChange}
  />
)
