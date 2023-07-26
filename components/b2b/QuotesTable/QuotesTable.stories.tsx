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
  quoteCollection: quotesMock,
  sortingValues: {
    selected: '',
    options: [
      { value: 'First Created', id: 'first created' },
      { value: 'Last Created', id: 'last created' },
      { value: 'Quote name: A-Z', id: 'name asc' },
      { value: 'Quote name: Z-A', id: 'name desc' },
      { value: 'Quote number: Low-High', id: 'number asc' },
      { value: 'Quote number: High-Low', id: 'number desc' },
    ],
  },
}
