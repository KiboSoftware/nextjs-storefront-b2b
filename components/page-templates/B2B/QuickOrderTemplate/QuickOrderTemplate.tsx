import React from 'react'

import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import { Stack, Typography, Box, Button, Grid, useMediaQuery, Theme } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { quickOrderTemplateStyles } from './QuickOrderTemplate.style'
import { QuickOrderTable, B2BProductSearch } from '@/components/b2b'
import { CartItemList } from '@/components/cart'
import {
  useCartActions,
  useGetCart,
  useGetPurchaseLocation,
  useGetStoreLocations,
  useProductCardActions,
} from '@/hooks'
import { FulfillmentOptions as FulfillmentOptionsConstant } from '@/lib/constants'
import { cartGetters, orderGetters, productGetters } from '@/lib/getters'

import { CrCart, CrCartItem, Location } from '@/lib/gql/types'

export interface QuickOrderTemplateProps {
  cart: CrCart
}

const QuickOrderTemplate = (props: QuickOrderTemplateProps) => {
  const { t } = useTranslation('common')

  const { data: cart } = useGetCart(props?.cart)
  const cartItems = cartGetters.getCartItems(cart)
  const tabAndDesktopScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const { openProductQuickViewModal, handleAddToCart } = useProductCardActions()

  const handleAddProduct = (product: any) => {
    if (!productGetters.isVariationProduct(product)) {
      const payload = {
        product: {
          productCode: productGetters.getProductId(product),
          variationProductCode: productGetters.getVariationProductCode(product),
          fulfillmentMethod: FulfillmentOptionsConstant.SHIP,
          purchaseLocationCode: '',
        },
        quantity: 1,
      }
      handleAddToCart(payload, false)
    } else {
      openProductQuickViewModal(product)
    }
  }

  const locationCodes = orderGetters.getFulfillmentLocationCodes(cartItems as CrCartItem[])
  const { data: locations } = useGetStoreLocations({ filter: locationCodes })
  const { data: purchaseLocation } = useGetPurchaseLocation()
  const fulfillmentLocations = locations && Object.keys(locations).length ? locations : []

  const { onFulfillmentOptionChange, handleQuantityUpdate, handleProductPickupLocation } =
    useCartActions({
      cartItems: cartItems as CrCartItem[],
      purchaseLocation,
    })

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            sx={quickOrderTemplateStyles.wrapIcon}
            direction="row"
            gap={2}
            onClick={() => null}
          >
            <ArrowBackIos fontSize="inherit" sx={quickOrderTemplateStyles.wrapIcon} />
            <Typography variant="body2">{t('my-account')}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="h1">{t('quick-order')}</Typography>
          </Box>
        </Grid>
        {tabAndDesktopScreen ? (
          <Grid item sm={6} display={'flex'} justifyContent={'flex-end'}>
            <Stack direction="row" gap={2}>
              <Button variant="contained" color="secondary">
                {t('initiate-quote')}
              </Button>
              <Button variant="contained" color="primary">
                {t('checkout')}
              </Button>
            </Stack>
          </Grid>
        ) : null}
        <Grid item xs={4}>
          <B2BProductSearch onAddProduct={handleAddProduct} />
        </Grid>
        <Grid item xs={12}>
          <Stack gap={3}>
            {tabAndDesktopScreen ? (
              <QuickOrderTable
                cartItems={cartItems as CrCartItem[]}
                fulfillmentLocations={fulfillmentLocations}
                purchaseLocation={purchaseLocation}
                onFulfillmentOptionChange={onFulfillmentOptionChange}
                onQuantityUpdate={handleQuantityUpdate}
                onStoreSetOrUpdate={handleProductPickupLocation}
              />
            ) : (
              <CartItemList
                cartItems={cartItems}
                fulfillmentLocations={fulfillmentLocations as Location[]}
                purchaseLocation={purchaseLocation}
                onCartItemDelete={() => null}
                onCartItemQuantityUpdate={handleQuantityUpdate}
                onFulfillmentOptionChange={onFulfillmentOptionChange}
                onProductPickupLocation={handleProductPickupLocation}
                onCartItemActionSelection={() => null}
              />
            )}

            {!tabAndDesktopScreen ? (
              <Stack spacing={2}>
                <Button variant="contained" color="secondary">
                  {t('initiate-quote')}
                </Button>
                <Button variant="contained" color="primary">
                  {t('checkout')}
                </Button>
              </Stack>
            ) : null}
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default QuickOrderTemplate
