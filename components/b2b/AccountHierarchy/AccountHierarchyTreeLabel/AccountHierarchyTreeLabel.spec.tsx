import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'

import * as stories from './AccountHierarchyTreeLabel.stories'
import { userResponseMock } from '@/__mocks__/stories'

const { Admin, Purchaser, NonPurchaser } = composeStories(stories)

const onAddMock = jest.fn()
const onEditMock = jest.fn()
const onViewMock = jest.fn()
const onDeleteMock = jest.fn()
const onBuyerClickMock = jest.fn()
const onQuotesClickMock = jest.fn()
interface AccountHierarchyActionsMockProps {
  onAdd: () => void
  onEdit: () => void
  onDelete: () => void
  onView: () => void
  onBuyerClick: () => void
  onQuotesClick: () => void
}

const companyOrOrganizationName = userResponseMock?.companyOrOrganization as string

const AccountHierarchyActionsMock = ({
  onAdd,
  onEdit,
  onDelete,
  onView,
  onBuyerClick,
  onQuotesClick,
}: AccountHierarchyActionsMockProps) => (
  <div data-testid="account-hierarchy-actions-mock">
    <button data-testid="item-add-mock-button" onClick={onAdd}>
      Add
    </button>
    <button data-testid="item-edit-mock-button" onClick={onEdit}>
      Edit
    </button>
    <button data-testid="item-delete-mock-button" onClick={onDelete}>
      Delete
    </button>
    <button data-testid="item-view-mock-button" onClick={onView}>
      View
    </button>
    <button data-testid="buyer-mock-button" onClick={onBuyerClick}>
      Buyers
    </button>
    <button data-testid="quote-mock-button" onClick={onQuotesClick}>
      Quotes
    </button>
  </div>
)

jest.mock(
  '@/components/b2b/AccountHierarchy/AccountHierarchyActions/AccountHierarchyActions',
  () => () =>
    AccountHierarchyActionsMock({
      onAdd: onAddMock,
      onEdit: onEditMock,
      onDelete: onDeleteMock,
      onView: onViewMock,
      onBuyerClick: onBuyerClickMock,
      onQuotesClick: onQuotesClickMock,
    })
)

describe('AccountHierarchyTreeLabel', () => {
  it('should render AccountHierarchyTreeLabel component', async () => {
    render(<Admin />)

    const treeLabel = screen.getByTestId('tree-label')
    expect(treeLabel).toBeVisible()

    const companyOrOrganization = screen.getByText(companyOrOrganizationName)
    expect(companyOrOrganization).toBeVisible()
  })

  it('Admin View - should render all action buttons', async () => {
    render(<Admin />)

    const accountAddButton = screen.getByTestId('item-add-mock-button')
    expect(accountAddButton).toBeVisible()
    accountAddButton.click()
    expect(onAddMock).toHaveBeenCalled()

    const accountEditButton = screen.getByTestId('item-edit-mock-button')
    expect(accountEditButton).toBeVisible()
    accountEditButton.click()
    expect(onEditMock).toHaveBeenCalled()

    const accountDeleteButton = screen.getByTestId('item-delete-mock-button')
    expect(accountDeleteButton).toBeVisible()
    accountDeleteButton.click()
    expect(onDeleteMock).toHaveBeenCalled()

    const buyerButton = screen.getByTestId('buyer-mock-button')
    expect(buyerButton).toBeVisible()
    buyerButton.click()
    expect(onBuyerClickMock).toHaveBeenCalled()

    const quoteButton = screen.getByTestId('quote-mock-button')
    expect(quoteButton).toBeVisible()
    quoteButton.click()
    expect(onQuotesClickMock).toHaveBeenCalled()
  })

  it('Purchaser View - should render only buyer and quotes buttons', async () => {
    render(<Purchaser />)

    const accountAddButton = screen.queryByRole('item-add-mock-button')
    expect(accountAddButton).not.toBeInTheDocument()

    const buyerButton = screen.getByTestId('buyer-mock-button')
    expect(buyerButton).toBeVisible()
  })

  it('Non Purchaser View - no actions should render', async () => {
    render(<NonPurchaser />)

    const accountAddButton = screen.queryByRole('item-add-mock-button')
    expect(accountAddButton).not.toBeInTheDocument()

    const quoteButton = screen.queryByText('quotes')
    expect(quoteButton).not.toBeInTheDocument()
  })
})
