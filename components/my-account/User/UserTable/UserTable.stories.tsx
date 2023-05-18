import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import UserTable from './UserTable'
import { customerB2bUserMock } from '@/__mocks__/stories/customerB2bUserMock'
import { userGetters } from '@/lib/getters'

import { B2BUser } from '@/lib/gql/types'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'User/UserTable',
  component: UserTable,
  argTypes: { onClick: { action: 'clicked' } },
} as ComponentMeta<typeof UserTable>

const customerb2bUsers: B2BUser[] = userGetters.getCustomerB2bUsers(
  customerB2bUserMock?.items as B2BUser[]
)

const Template: ComponentStory<typeof UserTable> = (args) => <UserTable {...args} />

export const Table = Template.bind({})

Table.args = {
  b2bUsersList: customerb2bUsers as B2BUser[],
  count: 5,
  totalCount: 5,
  startRange: 0,
  endRange: 5,
  isLoading: false,
}
