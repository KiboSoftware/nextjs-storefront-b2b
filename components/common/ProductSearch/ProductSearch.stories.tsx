import { ComponentStory, ComponentMeta } from '@storybook/react'

import ProductSearch from './ProductSearch'

export default {
  title: 'Common/ProductSearch',
  component: ProductSearch,
} as ComponentMeta<typeof ProductSearch>

export const ProductSearchComponent: ComponentStory<typeof ProductSearch> = (args) => (
  <ProductSearch />
)
