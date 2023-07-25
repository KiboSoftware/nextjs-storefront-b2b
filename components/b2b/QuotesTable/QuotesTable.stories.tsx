import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import QuotesTable from './QuotesTable'
import { cartResponse, locationCollectionMock } from '@/__mocks__/stories'
import { quotesMock } from '@/__mocks__/stories/quotesMock'

import { CrCartItem, Location } from '@/lib/gql/types'

export default {
  title: 'B2B/Quotes/QuotesTable',
  component: QuotesTable,

  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof QuotesTable>

const Template: ComponentStory<typeof QuotesTable> = (args) => <QuotesTable {...args} />

export const Common = Template.bind({})

Common.args = {
  //   quoteCollection:  {...quotesMock, items: []},
  quoteCollection: quotesMock,
}
