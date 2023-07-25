import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import AccountHierarchyForm from './AccountHierarchyForm'

export default {
  component: AccountHierarchyForm,
  title: 'My Account/B2B/AccountHierarchyForm',
  argTypes: {
    onClose: { action: 'onCancel' },
    onSave: { action: 'onSave' },
  },
} as ComponentMeta<typeof AccountHierarchyForm>

const Template: ComponentStory<typeof AccountHierarchyForm> = (args) => (
  <AccountHierarchyForm {...args} />
)

// Account Hierarchy
export const Common = Template.bind({})
Common.args = {
  user: { id: 1023, companyOrOrganization: 'Test Organization' },
}
