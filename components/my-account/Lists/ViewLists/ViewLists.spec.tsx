import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import mediaQuery from 'css-mediaquery'

import * as stories from './ViewLists.stories'
import { renderWithQueryClient } from '@/__test__/utils'
const { Common } = composeStories(stories)

const createMatchMedia = (width: number) => (query: string) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => jest.fn(),
  removeListener: () => jest.fn(),
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
})

const ListTableMock = () => <div data-testid="list-table-mock"></div>
jest.mock('@/components/my-account/Lists/ListTable/ListTable', () => () => ListTableMock())

const setup = () => {
  const user = userEvent.setup()
  renderWithQueryClient(<Common />)
  return { user }
}

describe('[componenet] - ViewLists', () => {
  it('should render loader for ViewLists', () => {
    setup()
    const loader = screen.getByRole('progressbar')
    expect(loader).toBeVisible
  })
  it('should render ViewLists component', async () => {
    window.matchMedia = createMatchMedia(1000)
    setup()
    const currentUserFilterCheckbox = await screen.findByTestId('currentUserFilterCheckbox')
    const pagination = await screen.findByTestId('pagination')
    const listTable = await screen.findByTestId('list-table-mock')
    expect(currentUserFilterCheckbox).toBeVisible()
    expect(pagination).toBeVisible()
    expect(listTable).toBeVisible()
  })
})
