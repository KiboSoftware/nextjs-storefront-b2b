import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import KiboPagination from './KiboPagination'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Common/KiboPagination',
  component: KiboPagination,
  argTypes: { onClick: { action: 'clicked' } },
} as ComponentMeta<typeof KiboPagination>

const Template: ComponentStory<typeof KiboPagination> = (args) => <KiboPagination {...args} />

export const Pagination = Template.bind({})

Pagination.args = {
  count: 20,
  size: 'medium',
}
