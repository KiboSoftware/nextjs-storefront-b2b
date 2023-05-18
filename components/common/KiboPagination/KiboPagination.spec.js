import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'

import * as stories from './KiboPagination.stories' // import all stories from the stories file

const { KiboPagination, Pagination } = composeStories(stories)

describe('[component] - KiboPagination', () => {
  it('should render table', () => {
    render(<KiboPagination {...Pagination.args} />)
  })
})
