import * as React from 'react'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useTranslation } from 'next-i18next'

import { FulfillmentOptions, Price, ProductItem, QuantitySelector } from '@/components/common'
import { FulfillmentOptions as FulfillmentOptionsConstant } from '@/lib/constants'
import { cartGetters, productGetters } from '@/lib/getters'
import { uiHelpers } from '@/lib/helpers'
import { FulfillmentOption } from '@/lib/types'

import { CrCartItem, CrProduct, Maybe, Location } from '@/lib/gql/types'

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]

const columns = [
  {
    field: 'product',
    headerName: 'Product',
  },
  {
    field: 'fulfillment',
    headerName: 'Fulfillment Method',
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
  },
  {
    field: 'price',
    headerName: 'Price',
  },
  {
    field: 'itemTotal',
    headerName: 'Item Total',
  },
]

interface QuickOrderTableProps {
  cartItems: CrCartItem[]
  fulfillmentLocations: Maybe<Location>[]
  purchaseLocation: Location
  onFulfillmentOptionChange: (value: string, id: string) => void
  onStoreSetOrUpdate: (id: string) => void
  onQuantityUpdate: (cartItemId: string, quantity: number) => void
}

export default function QuickOrderTable(props: QuickOrderTableProps) {
  const { t } = useTranslation('common')
  const {
    cartItems,
    fulfillmentLocations,
    purchaseLocation,
    onFulfillmentOptionChange,
    onStoreSetOrUpdate,
    onQuantityUpdate,
  } = props

  const { getProductLink } = uiHelpers()

  const handleSupportedFulfillmentOptions = (cartItem: CrCartItem): FulfillmentOption[] => {
    const location =
      cartItem?.fulfillmentLocationCode &&
      cartItem?.fulfillmentMethod === FulfillmentOptionsConstant.PICKUP
        ? cartGetters.getCartItemFulfillmentLocation(cartItem, fulfillmentLocations)
        : purchaseLocation
    return cartGetters.getProductFulfillmentOptions(cartItem, location)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="quick order table" size="medium">
        {!cartItems.length ? <caption>No Products Added</caption> : null}
        <TableHead>
          <TableRow
            sx={{
              '&:nth-of-type(odd)': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            {columns.map((column) => (
              <TableCell key={column.field} sx={{ fontWeight: 700 }}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.map((cartItem: CrCartItem) => (
            <TableRow key={cartItem.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <ProductItem
                  isQuickOrder
                  image={productGetters.getProductImage(cartItem.product as CrProduct)}
                  name={productGetters.getName(cartItem.product as CrProduct)}
                  productCode={productGetters.getProductId(cartItem.product as CrProduct)}
                  options={productGetters.getOptions(cartItem.product as CrProduct)}
                  link={getProductLink(cartItem.product?.productCode as string)}
                />
              </TableCell>
              <TableCell>
                <FulfillmentOptions
                  fulfillmentOptions={handleSupportedFulfillmentOptions(cartItem as CrCartItem)}
                  selected={cartItem?.fulfillmentMethod || ''}
                  onFulfillmentOptionChange={(fulfillmentMethod: string) =>
                    onFulfillmentOptionChange(fulfillmentMethod, cartItem?.id as string)
                  }
                  onStoreSetOrUpdate={() => onStoreSetOrUpdate(cartItem?.id as string)}
                />
              </TableCell>
              <TableCell>
                <QuantitySelector
                  quantity={cartItem?.quantity || 1} // needs to be modified
                  label={t('qty')}
                  maxQuantity={100} // needs to be modified
                  onIncrease={() =>
                    onQuantityUpdate(cartItem?.id as string, cartItem?.quantity + 1)
                  }
                  onDecrease={() =>
                    onQuantityUpdate(cartItem?.id as string, cartItem?.quantity - 1)
                  }
                  onQuantityUpdate={(q) => onQuantityUpdate(cartItem?.id as string, q)}
                />
              </TableCell>
              <TableCell>
                <Price
                  variant="body2"
                  fontWeight="bold"
                  price={t('currency', {
                    val: productGetters
                      .getPrice(cartItem?.product as CrProduct)
                      .regular?.toString(),
                  })}
                  salePrice={
                    productGetters.getPrice(cartItem?.product as CrProduct).special
                      ? t('currency', {
                          val: productGetters.getPrice(cartItem?.product as CrProduct).special,
                        })
                      : undefined
                  }
                />
              </TableCell>
              <TableCell>
                <Price
                  variant="body2"
                  fontWeight="bold"
                  price={t('currency', {
                    val: cartGetters.getLineItemPrice(cartItem).regular?.toString(),
                  })}
                  salePrice={
                    cartGetters.getLineItemPrice(cartItem).special
                      ? t('currency', {
                          val: cartGetters.getLineItemPrice(cartItem).special,
                        })
                      : undefined
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
