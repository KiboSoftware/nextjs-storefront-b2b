import React from 'react'

import '@testing-library/jest-dom'
import { composeStories } from '@storybook/testing-react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './B2BProductSearch.stories'
import { productSearchResultMock } from '@/__mocks__/stories'
import { renderWithQueryClient } from '@/__test__/utils/renderWithQueryClient'

const { Common } = composeStories(stories)

jest.mock('@/hooks', () => ({
  useDebounce: jest.fn(() => ''),
  useGetSearchedProducts: jest.fn().mockImplementation(() => ({
    data: productSearchResultMock,
  })),
}))

const ProductItemMock = () => <div data-testid="product-item-component" />
jest.mock('@/components/common/ProductItem/ProductItem', () => () => ProductItemMock())

const onChangeMock = jest.fn()
const onBlurMock = jest.fn()

describe('[components] - B2BProductSearch', () => {
  const setup = () => {
    const user = userEvent.setup()
    renderWithQueryClient(<Common />)
    return {
      user,
    }
  }

  it('should render component', async () => {
    const { user } = setup()

    const textBox = screen.getByRole('textbox', { name: 'search-for-product' })

    user.type(textBox, 'jacket')

    expect(textBox).toBeVisible()
    await waitFor(() => {
      const productItems = screen.queryAllByTestId(/product-item-component/i)
      expect(productItems.length).toBe(17)
    })
  })
})
