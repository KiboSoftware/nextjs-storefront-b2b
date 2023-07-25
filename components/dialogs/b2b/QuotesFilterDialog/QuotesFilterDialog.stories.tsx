import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import QuotesFilterDialog from './QuotesFilterDialog'
import { cartItemMock } from '@/__mocks__/stories/cartItemMock'

export default {
  title: 'Dialogs/B2B/QuotesFilterDialog',
  component: QuotesFilterDialog,
  argTypes: { closeModal: { action: 'closeModal' } },
} as ComponentMeta<typeof QuotesFilterDialog>

const Template: ComponentStory<typeof QuotesFilterDialog> = ({ ...args }) => (
  <QuotesFilterDialog {...args} />
)

// Common
export const Common = Template.bind({})

Common.args = {
  cartItem: cartItemMock,
  isDialogCentered: false,
}
