import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { render } from '@testing-library/react'

import * as stories from './WishlistTable.stories'

const { WishlistTableComponent } = composeStories(stories)

describe('[component] - Wishlist', () => {
  it('should render table', () => {
    render(<WishlistTableComponent />)
  })
})
