import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import AccountHierarchyFormDialog from './AccountHierarchyFormDialog'
import { userResponseMock } from '@/__mocks__/stories'

export default {
  title: 'Dialogs/AccountHierarchyFormDialog/Dialog',
  component: AccountHierarchyFormDialog,
  argTypes: {
    onClose: { action: 'onClose' },
    onSave: { action: 'onSave' },
  },
} as ComponentMeta<typeof AccountHierarchyFormDialog>

const mockUser = userResponseMock
const Template: ComponentStory<typeof AccountHierarchyFormDialog> = ({ ...args }) => (
  <AccountHierarchyFormDialog {...args} />
)

// Common
export const Common = Template.bind({})
Common.args = {
  accounts: [mockUser],
  isAddingAccountToChild: false,
}
