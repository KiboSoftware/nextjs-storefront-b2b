import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql } from 'msw'

import * as stories from './ProductSearch.stories'
import { searchSuggestionHandlers } from '@/__mocks__/msw/handlers'
import { server } from '@/__mocks__/msw/server'
import { searchSuggestionResultMock } from '@/__mocks__/stories/searchSuggestionResultMock'

const { ProductSearchComponent } = composeStories(stories)
function setup() {
  const user = userEvent.setup()
  const searchSuggestions = searchSuggestionResultMock
  render(<ProductSearchComponent />)
  return { user, searchSuggestions }
}

describe('[component] - Product Search', () => {
  const userEnteredText = 'DOG'

  it('should render Product Search', () => {
    setup()
    // getting the input box
    const input = screen.getByPlaceholderText('Search by product name or code')
    // checking if input visible to user
    expect(input).toBeVisible()
  })
  it('should change input', async () => {
    // getting the input box
    const { user } = setup()

    const input = await screen.findByPlaceholderText('Search by product name or code')
    await user.type(input, userEnteredText)
    await waitFor(() => {
      expect(input).toHaveValue(userEnteredText)
    })
  })
  // it.only('should display suggestions', async () => {
  //   const { user } = setup()
  //   const input = await screen.findByPlaceholderText('Search by product name or code')
  //   await user.type(input, userEnteredText)
  //   const response = server.use(searchSuggestionHandlers[0])
  //   console.warn('response ==>', response)
  // })
})
