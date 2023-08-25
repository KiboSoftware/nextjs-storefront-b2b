import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import KiboCollapseIndicator from './KiboCollapseIndicator'

export default {
  component: KiboCollapseIndicator,
  title: 'Common/KiboCollapseIndicator',
} as ComponentMeta<typeof KiboCollapseIndicator>

const Template: ComponentStory<typeof KiboCollapseIndicator> = ({ ...args }) => (
  <KiboCollapseIndicator {...args} />
)

// Collapsed
export const Collapsed = Template.bind({})

Collapsed.args = {
  isCollapsed: false,
}

export const Expand = Template.bind({})

Expand.args = {
  isCollapsed: true,
}
