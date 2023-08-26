import { composeStories } from '@storybook/testing-react'
import { fireEvent, render, screen } from '@testing-library/react'

import * as stories from './AccountHierarchyTreeLabel.stories'
import { b2BAccountHierarchyResult } from '@/__mocks__/stories'

const { Admin, Purchaser, NonPurchaser } = composeStories(stories)

const onAddMock = jest.fn()
const onEditMock = jest.fn()
const onViewMock = jest.fn()
const onParentChangeMock = jest.fn()
const onBuyerClickMock = jest.fn()
const onQuotesClickMock = jest.fn()

const companyOrOrganizationName = b2BAccountHierarchyResult?.accounts?.[0]
  ?.companyOrOrganization as string

describe('AccountHierarchyTreeLabel', () => {
  it('should render component', async () => {
    render(<Admin />)

    const treeLabel = screen.getByTestId('tree-label')
    expect(treeLabel).toBeVisible()

    const companyOrOrganization = screen.getByText(companyOrOrganizationName)
    expect(companyOrOrganization).toBeVisible()
  })

  it('Admin View - should render all action buttons', async () => {
    render(
      <Admin
        handleAddAccount={onAddMock}
        handleEditAccount={onEditMock}
        handleViewAccount={onViewMock}
        handleChangeParent={onParentChangeMock}
        handleQuotesBtnClick={onQuotesClickMock}
        handleBuyersBtnClick={onBuyerClickMock}
      />
    )

    const accountAddButton = screen.getByRole('button', { name: 'item-add' })
    expect(accountAddButton).toBeVisible()
    fireEvent.click(accountAddButton)
    expect(onAddMock).toHaveBeenCalled()

    const accountEditButton = screen.getByRole('button', { name: 'item-edit' })
    expect(accountEditButton).toBeVisible()
    fireEvent.click(accountEditButton)
    expect(onParentChangeMock).toHaveBeenCalled()

    const accountViewButton = screen.getByRole('button', { name: 'item-view' })
    expect(accountViewButton).toBeVisible()
    fireEvent.click(accountViewButton)
    expect(onViewMock).toHaveBeenCalled()

    const buyerButton = screen.getByText('buyers')
    expect(buyerButton).toBeVisible()
    fireEvent.click(buyerButton)
    expect(onBuyerClickMock).toHaveBeenCalled()

    const quoteButton = screen.getByText('quotes')
    expect(quoteButton).toBeVisible()
    fireEvent.click(quoteButton)
    expect(onQuotesClickMock).toHaveBeenCalled()

    const listItemIcon = screen.getByRole('listitem')
    expect(listItemIcon).toBeVisible()
  })

  it('Purchaser View - should render only buyer and quotes buttons', async () => {
    render(<Purchaser />)

    const accountAddButton = screen.queryByRole('button', { name: 'item-add' })
    expect(accountAddButton).not.toBeInTheDocument()

    const buyerButton = screen.getByText('buyers')
    expect(buyerButton).toBeVisible()
  })

  it('Non Purchaser View - no actions should render', async () => {
    render(<NonPurchaser />)

    const accountAddButton = screen.queryByRole('button', { name: 'item-add' })
    expect(accountAddButton).not.toBeInTheDocument()

    const quoteButton = screen.queryByText('quotes')
    expect(quoteButton).not.toBeInTheDocument()
  })
})
