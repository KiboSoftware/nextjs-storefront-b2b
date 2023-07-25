import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import AccountHierarchyFormDialog from './AccountHierarchyFormDialog'

export default {
  title: 'Dialogs/AccountHierarchyFormDialog/Dialog',
  component: AccountHierarchyFormDialog,
  argTypes: {
    onClose: { action: 'onClose' },
    onSave: { action: 'onSave' },
  },
} as ComponentMeta<typeof AccountHierarchyFormDialog>

const Template: ComponentStory<typeof AccountHierarchyFormDialog> = ({ ...args }) => (
  <AccountHierarchyFormDialog {...args} />
)

// Common
export const Common = Template.bind({})
Common.args = {
  user: { id: 1023, companyOrOrganization: 'Test Organization' },
}
