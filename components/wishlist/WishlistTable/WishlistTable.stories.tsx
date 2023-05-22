import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import WishlistTable from './WishlistTable'
import { wishlistTableMock } from '@/__mocks__/stories'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

export default {
  title: 'Wishlist/WishlistTable',
  component: WishlistTable,
} as ComponentMeta<typeof WishlistTable>

export const WishlistTableComponent: ComponentStory<typeof WishlistTable> = (args) => (
  <WishlistTable
    rows={wishlistTableMock.rows}
    hiddenColumns={{}}
    isLoading={false}
    pageCount={wishlistTableMock.pageCount}
    handleCopyWishlist={() => alert('custom action in wishlist')}
    handleDeleteWishlist={() => alert('custom action in wishlist')}
    handleEditWishlist={() => alert('custom action in wishlist')}
    pageOnChange={() => alert('custom action to change page from wishlist')}
  />
)
