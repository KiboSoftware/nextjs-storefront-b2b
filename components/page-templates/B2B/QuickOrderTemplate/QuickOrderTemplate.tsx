import React, { useState } from 'react'

import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import { Stack, Typography, Box, Button, Grid, useMediaQuery, Theme } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { quickOrderTemplateStyles } from './QuickOrderTemplate.style'
import { QuickOrderTable, B2BProductSearch } from '@/components/b2b'
import { CartItemList } from '@/components/cart'
import { KeyValueDisplay, PromoCodeBadge } from '@/components/common'
import {
  useCartActions,
  useGetCart,
  useGetPurchaseLocation,
  useGetStoreLocations,
  useProductCardActions,
  useUpdateCartCoupon,
  useDeleteCartCoupon,
  useDeleteCartItem,
} from '@/hooks'
import { FulfillmentOptions as FulfillmentOptionsConstant } from '@/lib/constants'
import { cartGetters, orderGetters, productGetters } from '@/lib/getters'

import { CrCart, CrCartItem, Location } from '@/lib/gql/types'

export interface QuickOrderTemplateProps {
  cart: CrCart
}

const QuickOrderTemplate = (props: QuickOrderTemplateProps) => {
  const { t } = useTranslation('common')
  const tabAndDesktopScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const [promoError, setPromoError] = useState<string>('')
  const { data: cart } = useGetCart(props?.cart)
  const cartItems = cartGetters.getCartItems(cart)
  const cartTotal = orderGetters.getTotal(cart)

  const locationCodes = orderGetters.getFulfillmentLocationCodes(cartItems as CrCartItem[])
  const { data: locations } = useGetStoreLocations({ filter: locationCodes })
  const fulfillmentLocations = locations && Object.keys(locations).length ? locations : []

  const { deleteCartItem } = useDeleteCartItem()
  const { updateCartCoupon } = useUpdateCartCoupon()
  const { deleteCartCoupon } = useDeleteCartCoupon()

  const { data: purchaseLocation } = useGetPurchaseLocation()
  const { openProductQuickViewModal, handleAddToCart } = useProductCardActions()
  const { onFulfillmentOptionChange, handleQuantityUpdate, handleProductPickupLocation } =
    useCartActions({
      cartItems: cartItems as CrCartItem[],
      purchaseLocation,
    })

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
      const dialogProps = {
        title: t('product-configuration-options'),
        cancel: t('cancel'),
        addItemToCart: t('add-item-to-cart'),
        isB2B: true,
      }
      openProductQuickViewModal(product, dialogProps)
    }
  }

  const handleApplyCouponCode = async (couponCode: string) => {
    try {
      setPromoError('')
      const response = await updateCartCoupon.mutateAsync({
        cartId: cart?.id as string,
        couponCode,
      })
      if (response?.invalidCoupons?.length) {
        setPromoError(response?.invalidCoupons[0]?.reason)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveCouponCode = async (couponCode: string) => {
    try {
      await deleteCartCoupon.mutateAsync({
        cartId: cart?.id as string,
        couponCode,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteItem = async (cartItemId: string) => {
    await deleteCartItem.mutateAsync({ cartItemId })
  }

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
            {tabAndDesktopScreen && <Typography variant="body2">{t('my-account')}</Typography>}
            {!tabAndDesktopScreen && (
              <Box sx={quickOrderTemplateStyles.quickOrderTextBox}>
                <Typography variant="h2" sx={quickOrderTemplateStyles.quickOrderText}>
                  {t('quick-order')}
                </Typography>
              </Box>
            )}
          </Stack>
        </Grid>
        {tabAndDesktopScreen && (
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="h1">{t('quick-order')}</Typography>
            </Box>
          </Grid>
        )}
        <Grid item sm={6} display={'flex'} justifyContent={'flex-end'}>
          {tabAndDesktopScreen ? (
            <Stack direction="row" gap={2}>
              <Button variant="contained" color="secondary">
                {t('initiate-quote')}
              </Button>
              <Button variant="contained" color="primary">
                {t('checkout')}
              </Button>
            </Stack>
          ) : null}
        </Grid>
        <Grid item xs={12} md={4}>
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
                onCartItemDelete={handleDeleteItem}
              />
            ) : (
              <Stack spacing={2}>
                <Typography variant="h2">{t('cart')}</Typography>
                {cartItems.length > 0 ? (
                  <CartItemList
                    cartItems={cartItems}
                    fulfillmentLocations={fulfillmentLocations as Location[]}
                    purchaseLocation={purchaseLocation}
                    onCartItemDelete={handleDeleteItem}
                    onCartItemQuantityUpdate={handleQuantityUpdate}
                    onFulfillmentOptionChange={onFulfillmentOptionChange}
                    onProductPickupLocation={handleProductPickupLocation}
                    onCartItemActionSelection={() => null}
                  />
                ) : (
                  <Typography variant="body1" sx={quickOrderTemplateStyles.noCartItems}>
                    {t('search-to-add-products')}
                  </Typography>
                )}
              </Stack>
            )}

            {!tabAndDesktopScreen && cartItems.length ? (
              <Stack spacing={2}>
                <Button variant="contained" color="primary">
                  {t('checkout')}
                </Button>
                <Button variant="contained" color="secondary">
                  {t('initiate-quote')}
                </Button>
              </Stack>
            ) : null}
          </Stack>
        </Grid>
        {tabAndDesktopScreen ? (
          <Grid item xs={12}>
            <Stack sx={quickOrderTemplateStyles.promoCode}>
              <PromoCodeBadge
                onApplyCouponCode={handleApplyCouponCode}
                onRemoveCouponCode={handleRemoveCouponCode}
                promoError={!!promoError}
                helpText={promoError}
                couponLabel="Coupon"
              />
              <KeyValueDisplay
                option={{
                  name: t('order-total'),
                  value: `${t('currency', { val: cartTotal })} `,
                }}
                variant="body1"
                sx={quickOrderTemplateStyles.orderTotal}
              />
            </Stack>
          </Grid>
        ) : null}
      </Grid>
    </>
  )
}

export default QuickOrderTemplate
