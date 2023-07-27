import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import QuoteCommentThreadDialog from './QuoteCommentThreadDialog'

export default {
  title: 'Dialogs/B2B/QuoteCommentThreadDialog',
  component: QuoteCommentThreadDialog,
  argTypes: { closeModal: { action: 'closeModal' } },
} as ComponentMeta<typeof QuoteCommentThreadDialog>

const Template: ComponentStory<typeof QuoteCommentThreadDialog> = ({ ...args }) => (
  <QuoteCommentThreadDialog {...args} />
)

// Common
export const Common = Template.bind({})
