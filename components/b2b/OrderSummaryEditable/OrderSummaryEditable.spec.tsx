import React from 'react'

import '@testing-library/jest-dom'
import { composeStories } from '@storybook/testing-react'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import getConfig from 'next/config'

import * as stories from './OrderSummaryEditable.stories'
import { renderWithQueryClient } from '@/__test__/utils/renderWithQueryClient'

const { Common } = composeStories(stories)

const user = userEvent.setup()

jest.mock('next/config', () => {
  return () => ({
    publicRuntimeConfig: {
      debounceTimeout: '100',
      b2bProductSearchPageSize: 16,
    },
  })
})

const ProductItemMock = () => (
  <div data-testid="product-item-component">
    <button data-testid="product-item">Product Item</button>
  </div>
)
jest.mock('@/components/common/ProductItem/ProductItem', () => () => ProductItemMock())

const onChangeMock = jest.fn()
const { publicRuntimeConfig } = getConfig()

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
    t: (key: string, options?: { val: number | string }) =>
      key === 'currency' ? `$${options?.val}` : key,
  }),
}))

describe('[components] - OrderSummaryEditable', () => {
  it('should render component', async () => {
    renderWithQueryClient(<Common />)

    expect(screen.getByText('summary')).toBeVisible()

    expect(
      screen.getByRole('button', { name: `titleTotal $${Common?.args?.itemTotal?.toString()}` })
    ).toBeVisible()

    expect(
      screen.getByRole('button', {
        name: `titleTotal $${Common?.args?.shippingTotal?.toString()}`,
      })
    ).toBeVisible()

    expect(
      screen.getByRole('button', {
        name: `titleTotal $${Common?.args?.handlingTotal?.toString()}`,
      })
    ).toBeVisible()

    expect(screen.getByRole('listitem', { name: 'duty-total' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'edit' }))

    expect(screen.getAllByRole('listitem', { name: 'subtotal' }).length).toBe(3)
    expect(screen.getAllByRole('listitem', { name: 'adjustment' }).length).toBe(3)
    expect(screen.getAllByRole('listitem', { name: 'tax' }).length).toBe(3)

    expect(screen.getAllByRole('textbox', { name: 'adjustment-input' }).length).toBe(3)
    expect(screen.getAllByRole('radiogroup', { name: 'adjustment-type' }).length).toBe(3)
  })

  it('should call onSave callback on saving adjustment changes', async () => {
    const onSaveMock = jest.fn()
    renderWithQueryClient(<Common onSave={onSaveMock} />)

    await user.click(screen.getByRole('button', { name: 'edit' }))

    const itemAdjustmentTextBox = screen.getAllByRole('textbox', { name: 'adjustment-input' })[0]
    const itemAmountAdjustmentRadio = screen.getAllByRole('radio', { name: 'amount' })[0]
    const itemPercentageAdjustmentRadio = screen.getAllByRole('radio', { name: 'percentage' })[0]

    const adjustMentSelect = screen.getAllByRole('button', { name: 'adjustment' })[0]

    expect(itemAmountAdjustmentRadio).toBeChecked()
    expect(itemPercentageAdjustmentRadio).not.toBeChecked()
    expect(adjustMentSelect).toBeVisible()

    const adjustmentProp = Common.args?.adjustment?.toString() as string
    const subtotalProp = Common.args?.subTotal?.toString() as string

    expect(screen.getAllByRole('listitem', { name: 'adjustment' })[0]).toHaveTextContent(
      adjustmentProp
    )

    await user.type(itemAdjustmentTextBox, '50')

    expect(screen.getAllByRole('listitem', { name: 'adjustment' })[0]).toHaveTextContent(
      'adjustment-text$-50'
    )

    await user.click(itemPercentageAdjustmentRadio)

    expect(screen.getAllByRole('listitem', { name: 'adjustment' })[0]).toHaveTextContent(
      `adjustment-text$-${parseInt(subtotalProp) * (50 / 100)}` // considering percentage adjustment
    )

    fireEvent.mouseDown(adjustMentSelect)

    const listbox = within(screen.getByRole('listbox'))

    fireEvent.click(listbox.getByText(/Add to Item Subtotal/i))

    expect(itemAdjustmentTextBox).toHaveValue('')

    await user.type(itemAdjustmentTextBox, '200')

    expect(screen.getAllByRole('listitem', { name: 'adjustment' })[0]).toHaveTextContent(
      `adjustment-text$${parseInt(subtotalProp) * (200 / 100)}` // considering percentage adjustment
    )

    await user.click(screen.getByRole('button', { name: 'save' }))

    await waitFor(() => {
      expect(onSaveMock).toBeCalledWith({
        adjustment: parseInt(subtotalProp) * (200 / 100),
        shippingAdjustment: Common.args?.shippingAdjustment,
        handlingAdjustment: Common.args?.handlingAdjustment,
      })
    })
  })
})
