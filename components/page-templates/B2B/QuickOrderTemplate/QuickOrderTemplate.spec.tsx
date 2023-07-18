import React from 'react'

import { useMediaQuery } from '@mui/material'
import { composeStories } from '@storybook/testing-react'
import { screen, render, waitFor } from '@testing-library/react'

import * as stories from './QuickOrderTemplate.stories'
const { Common, QuickOrderTemplateMobile } = composeStories(stories)

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}))

const B2BProductSearchMock = () => <div data-testid="b2b-product-search-component" />
const QuickOrderTableMock = () => <div data-testid="quick-order-table-component" />
const CartItemListMock = () => <div data-testid="cart-item-list-component" />
const KeyValueDisplayMock = () => <div data-testid="key-value-display-component" />
const PromoCodeBadgeMock = () => <div data-testid="promo-code-badge-component" />

jest.mock('@/components/b2b/QuickOrderTable/QuickOrderTable', () => () => QuickOrderTableMock())
jest.mock('@/components/b2b/B2BProductSearch/B2BProductSearch', () => () => B2BProductSearchMock())
jest.mock('@/components/cart/CartItemList/CartItemList', () => () => CartItemListMock())
jest.mock('@/components/common/KeyValueDisplay/KeyValueDisplay', () => () => KeyValueDisplayMock())
jest.mock('@/components/common/PromoCodeBadge/PromoCodeBadge', () => () => PromoCodeBadgeMock())

describe('[components] QuickOrderTemplate', () => {
  it('should render QuickOrderTemplate Desktop component', async () => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(useMediaQuery as jest.Mock).mockReturnValueOnce(true)
    render(<Common {...Common.args} />)

    const quickOrderText = screen.getByText(/quick-order/i)
    const initiateQuoteButton = screen.getByRole('button', { name: 'initiate-quote' })
    const checkoutButton = screen.getByRole('button', { name: 'checkout' })
    const b2bProductComponent = screen.getByTestId('b2b-product-search-component')
    const promoCodeComponent = screen.getByTestId('promo-code-badge-component')
    const orderTotalComponent = screen.getByTestId('key-value-display-component')

    expect(quickOrderText).toBeVisible()
    expect(screen.getByText(/my-account/i)).toBeVisible()
    expect(b2bProductComponent).toBeVisible()

    await waitFor(() => {
      const quickOrderTableComponent = screen.queryByTestId('quick-order-table-component')
      expect(quickOrderTableComponent).toBeVisible()
    })

    expect(initiateQuoteButton).toBeVisible()
    expect(checkoutButton).toBeVisible()
    expect(promoCodeComponent).toBeVisible()
    expect(orderTotalComponent).toBeVisible()
  })

  it('should render QuickOrderTemplate Mobile component', async () => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(useMediaQuery as jest.Mock).mockReturnValueOnce(false)

    render(<QuickOrderTemplateMobile {...QuickOrderTemplateMobile.args} />)
    const quickOrderText = screen.getByText(/quick-order/i)
    const b2bProductComponent = screen.getByTestId('b2b-product-search-component')

    expect(b2bProductComponent).toBeVisible()
    expect(quickOrderText).toBeVisible()

    await waitFor(() => {
      const cartItemListComponents = screen.queryByTestId('cart-item-list-component')
      expect(cartItemListComponents).toBeVisible()
    })
    await waitFor(() => {
      const initiateQuoteButton = screen.queryByRole('button', { name: /initiate-quote/i })
      expect(initiateQuoteButton).toBeVisible()
    })
    await waitFor(() => {
      const checkoutButton = screen.queryByRole('button', { name: /checkout/i })
      expect(checkoutButton).toBeVisible()
    })
  })
})
