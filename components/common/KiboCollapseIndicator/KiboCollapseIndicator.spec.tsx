import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'

import * as stories from './KiboCollapseIndicator.stories' // import all stories from the stories file

const { Collapsed, Expand } = composeStories(stories)

describe('[components] Dialog Component', () => {
  it('should show ExpandMoreIcon when isCollapsed is false', () => {
    render(<Collapsed />)

    const collapseIcon = screen.getByTestId('ExpandMoreIcon')

    expect(collapseIcon).toBeVisible()
  })

  it('should show ChevronRightIcon when isCollapsed is true', () => {
    render(<Expand />)

    const collapseIcon = screen.getByTestId('ChevronRightIcon')

    expect(collapseIcon).toBeVisible()
  })
})
