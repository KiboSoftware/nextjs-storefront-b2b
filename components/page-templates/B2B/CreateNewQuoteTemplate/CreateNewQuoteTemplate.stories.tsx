import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import CreateNewQuoteTemplate from './CreateNewQuoteTemplate'

// Common
export default {
  title: 'Page Templates/B2B/CreateNewQuoteTemplate',
  component: CreateNewQuoteTemplate,
  argTypes: {
    onAccountTitleClick: { action: 'onAccountTitleClick' },
  },
} as ComponentMeta<typeof CreateNewQuoteTemplate>

const Template: ComponentStory<typeof CreateNewQuoteTemplate> = (args) => (
  <CreateNewQuoteTemplate {...args} />
)

export const Common = Template.bind({})

export const CreateNewQuoteTemplateMobile = Template.bind({})
CreateNewQuoteTemplateMobile.parameters = {
  viewport: {
    defaultViewport: 'iphone12promax',
  },
}
