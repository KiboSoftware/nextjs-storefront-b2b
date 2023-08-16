import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import AccountHierarchyEditFormDialog from './AccountHierarchyEditFormDialog'
import { b2BAccountHierarchyResult } from '@/__mocks__/stories'

export default {
  title: 'Dialogs/B2B/AccountHierarchyEditFormDialog',
  component: AccountHierarchyEditFormDialog,
  argTypes: {
    onClose: { action: 'onClose' },
    onSave: { action: 'onSave' },
  },
} as ComponentMeta<typeof AccountHierarchyEditFormDialog>

const Template: ComponentStory<typeof AccountHierarchyEditFormDialog> = ({ ...args }) => (
  <AccountHierarchyEditFormDialog {...args} />
)

// Common
export const Common = Template.bind({})
Common.args = {
  accounts: b2BAccountHierarchyResult?.accounts,
  accountToEdit: b2BAccountHierarchyResult?.accounts?.[1],
}
