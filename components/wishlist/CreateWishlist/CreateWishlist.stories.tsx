import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import CreateWislist from './createWishlist'

const mockFunction = jest.fn()

export default {
  title: 'Wishlist/CreateWishlist',
  component: CreateWislist,
} as ComponentMeta<typeof CreateWislist>

export const CreateWishlistComponent: ComponentStory<typeof CreateWislist> = (args) => (
  <CreateWislist handleCreateWishlist={mockFunction} />
)
