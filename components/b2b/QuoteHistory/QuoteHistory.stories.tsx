import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import QuoteHistory from './QuoteHistory'
import { quoteMock } from '@/__mocks__/stories/quoteMock'

// Common
export default {
  title: 'B2B/QuoteHistory',
  component: QuoteHistory,
} as ComponentMeta<typeof QuoteHistory>

const Template: ComponentStory<typeof QuoteHistory> = (args) => <QuoteHistory {...args} />

export const Common = Template.bind({})

Common.args = {
  auditHistory: quoteMock.auditHistory,
}
