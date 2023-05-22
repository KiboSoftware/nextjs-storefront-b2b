/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'

import '@testing-library/jest-dom'
import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import mockRouter from 'next-router-mock'

import * as stories from './MyAccountTemplate.stories' // import all stories from the stories file
const { Common } = composeStories(stories)

const FullWidthDividerMock = () => <div data-testid="full-width-divider-component" />
jest.mock('../../common/FullWidthDivider/FullWidthDivider', () => () => FullWidthDividerMock())

describe('[component] - MyAccountTemplate', () => {
  const setup = () => {
    const user = userEvent.setup()
    render(<Common />)
    return {
      user,
    }
  }

  it('should render component', async () => {
    setup()

    const myAccount = screen.getByText(/my-account/i)
    const myProfile = screen.getByText(/my-profile/i)
    const addressBook = screen.getByText(/address-book/i)
    const paymentMethod = screen.getAllByText(/payment-method/)[0]
    const orderDetails = screen.getByText(/order-details/i)
    const quickOrder = screen.getByText(/quick-order/i)
    const returns = screen.getByText(/returns/i)
    const quotes = screen.getByText(/quotes/i)
    const lists = screen.getByText(/lists/i)
    const orderHistory = screen.getByText(/order-history/i)
    const logout = screen.getByText(/logout/i)

    expect(myAccount).toBeInTheDocument()
    expect(myProfile).toBeInTheDocument()
    expect(addressBook).toBeInTheDocument()
    expect(paymentMethod).toBeInTheDocument()
    expect(orderDetails).toBeInTheDocument()
    expect(quickOrder).toBeInTheDocument()
    expect(returns).toBeInTheDocument()
    expect(quotes).toBeInTheDocument()
    expect(lists).toBeInTheDocument()
    expect(orderHistory).toBeInTheDocument()
    expect(logout).toBeInTheDocument()
  })

  it('should redirect to order-history page when users click on Order History link', async () => {
    const { user } = setup()

    const orderHistory = screen.getByText(/order-history/i)

    await user.click(orderHistory)

    expect(mockRouter).toMatchObject({
      asPath: '/my-account/order-history?filters=M-6',
      pathname: '/my-account/order-history',
      query: { filters: 'M-6' },
    })
  })

  it('should redirect to users list page when users click on Users link', async () => {
    const { user } = setup()

    const users = screen.getByText(/users/i)

    await user.click(users)

    expect(mockRouter).toMatchObject({
      asPath: '/my-account/users',
      pathname: '/my-account/users',
    })
  })
})
