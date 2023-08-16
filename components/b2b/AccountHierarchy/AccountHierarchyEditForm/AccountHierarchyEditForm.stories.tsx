import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import AccountHierarchyEditForm from './AccountHierarchyEditForm'
import { b2BAccountHierarchyResult, userResponseMock } from '@/__mocks__/stories'

import { B2BAccount } from '@/lib/gql/types'

export default {
  component: AccountHierarchyEditForm,
  title: 'My Account/B2B/AccountHierarchyEditForm',
  argTypes: {
    onClose: { action: 'onCancel' },
    onSave: { action: 'onSave' },
  },
} as ComponentMeta<typeof AccountHierarchyEditForm>

const Template: ComponentStory<typeof AccountHierarchyEditForm> = (args) => (
  <AccountHierarchyEditForm {...args} />
)

// Account Hierarchy
export const Common = Template.bind({})
Common.args = {
  accounts: b2BAccountHierarchyResult?.accounts,
  accountToEdit: b2BAccountHierarchyResult?.accounts?.[1],
}
