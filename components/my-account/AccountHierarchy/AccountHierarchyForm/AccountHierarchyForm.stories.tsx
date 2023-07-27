import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import AccountHierarchyForm from './AccountHierarchyForm'
import { userResponseMock } from '@/__mocks__/stories'

export default {
  component: AccountHierarchyForm,
  title: 'My Account/B2B/AccountHierarchyForm',
  argTypes: {
    onClose: { action: 'onCancel' },
    onSave: { action: 'onSave' },
  },
} as ComponentMeta<typeof AccountHierarchyForm>

const mockUser = userResponseMock

const Template: ComponentStory<typeof AccountHierarchyForm> = (args) => (
  <AccountHierarchyForm {...args} />
)

// Account Hierarchy
export const Common = Template.bind({})
Common.args = {
  accounts: [mockUser],
  isAddingAccountToChild: false,
}

export const AddAccountToChild = Template.bind({})
AddAccountToChild.args = {
  accounts: [mockUser],
  isAddingAccountToChild: true,
}
