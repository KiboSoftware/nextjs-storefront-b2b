import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import PurchaseOrderForm from './PurchaseOrderForm'

export default {
  component: PurchaseOrderForm,
  title: 'checkout/PurchaseOrderForm',
} as ComponentMeta<typeof PurchaseOrderForm>

const Template: ComponentStory<typeof PurchaseOrderForm> = (args) => <PurchaseOrderForm {...args} />

// Common
export const Common = Template.bind({})
