import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import QuickOrderProductSearch from './QuickOrderProductSearch'

// Common
export default {
  title: 'B2B/quick-order/QuickOrderProductSearch',
  component: QuickOrderProductSearch,
} as ComponentMeta<typeof QuickOrderProductSearch>

const Template: ComponentStory<typeof QuickOrderProductSearch> = (args) => (
  <QuickOrderProductSearch {...args} />
)

export const Common = Template.bind({})
