import React, { useState } from 'react'

import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import {
  Stack,
  Typography,
  Box,
  Button,
  Grid,
  useMediaQuery,
  Theme,
  InputLabel,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { createNewQuoteTemplateStyles } from './CreateNewQuoteTemplate.style'
import { B2BProductDetailsTable, B2BProductSearch } from '@/components/b2b'
import { CartItemList } from '@/components/cart'
import { KeyValueDisplay, KiboTextBox, PromoCodeBadge } from '@/components/common'
import { useAuthContext } from '@/context'
import {
  useCartActions,
  useGetCart,
  useGetPurchaseLocation,
  useGetStoreLocations,
  useProductCardActions,
  useUpdateCartCoupon,
  useDeleteCartCoupon,
  useDeleteCartItem,
  useGetB2BUserQueries,
} from '@/hooks'
import { FulfillmentOptions as FulfillmentOptionsConstant } from '@/lib/constants'
import { cartGetters, orderGetters, productGetters, quoteGetters } from '@/lib/getters'

import { CrCart, CrCartItem, Location, Quote } from '@/lib/gql/types'

export interface CreateNewQuoteTemplateProps {
  quote: Quote
  onAccountTitleClick: () => void
}

const CreateNewQuoteTemplate = (props: CreateNewQuoteTemplateProps) => {
  const { quote, onAccountTitleClick } = props
  const { t } = useTranslation('common')
  const mdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const { isAuthenticated, user } = useAuthContext()

  const [promoError, setPromoError] = useState<string>('')
  const { data, isLoading } = useGetB2BUserQueries({
    accountId: user?.id as number,
    filter: `userId eq ${quote?.userId}`,
  })
  // const { data: cart } = useGetCart(cartData)
  const quoteNumber = quoteGetters.getNumber(quote)
  const quoteStatus = quoteGetters.getStatus(quote)
  const createDate = quoteGetters.getQuoteCreateDate(quote)
  const expirationDate = quoteGetters.getQuoteExpirationData(quote) ?? '-'
  const accountName = user?.companyOrOrganization
  const createdBy = (data?.items?.[0]?.firstName + ' ' + data?.items?.[0]?.lastName) as string

  // const locationCodes = orderGetters.getFulfillmentLocationCodes(cartItems as CrCartItem[])
  // const { data: locations } = useGetStoreLocations({ filter: locationCodes })
  // const fulfillmentLocations = locations && Object.keys(locations).length ? locations : []

  const { deleteCartItem } = useDeleteCartItem()
  const { updateCartCoupon } = useUpdateCartCoupon()
  const { deleteCartCoupon } = useDeleteCartCoupon()

  const { data: purchaseLocation } = useGetPurchaseLocation()
  const { openProductQuickViewModal, handleAddToCart } = useProductCardActions()
  // const { onFulfillmentOptionChange, handleQuantityUpdate, handleProductPickupLocation } =
  //   useCartActions({
  //     cartItems: cartItems as CrCartItem[],
  //     purchaseLocation,
  //   })

  const handleAddProduct = (product: any) => {
    if (productGetters.isVariationProduct(product)) {
      const dialogProps = {
        title: t('product-configuration-options'),
        cancel: t('cancel'),
        addItemToCart: t('add-item-to-cart'),
        isB2B: true,
      }
      openProductQuickViewModal(product, dialogProps)
    } else {
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
    }
  }

  const handleDeleteItem = async (cartItemId: string) => {
    await deleteCartItem.mutateAsync({ cartItemId })
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack sx={createNewQuoteTemplateStyles.wrapIcon} direction="row" gap={2}>
            <Box sx={{ display: 'flex' }} onClick={onAccountTitleClick}>
              <ArrowBackIos fontSize="inherit" sx={createNewQuoteTemplateStyles.wrapIcon} />
              {mdScreen && <Typography variant="body2">{t('quotes')}</Typography>}
            </Box>
            {!mdScreen && (
              <Box sx={createNewQuoteTemplateStyles.createNewQuoteTextBox}>
                <Typography variant="h2" sx={createNewQuoteTemplateStyles.createNewQuoteText}>
                  {t('create-quote')}
                </Typography>
              </Box>
            )}
          </Stack>
        </Grid>
        {mdScreen && (
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="h1">{t('create-quote')}</Typography>
            </Box>
          </Grid>
        )}
        <Grid item sm={6} display={'flex'} justifyContent={'flex-end'}>
          {mdScreen ? (
            <Stack direction="row" gap={2}>
              <Button variant="contained" color="secondary">
                {t('clear-changes')}
              </Button>
              <Button variant="contained" color="inherit">
                {t('save-and-exit')}
              </Button>
              <Button variant="contained" color="primary">
                {t('submit-for-approval')}
              </Button>
            </Stack>
          ) : null}
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h2" mb={2}>
            {t('quote-details')}
          </Typography>
          <Button variant="contained" color="secondary">
            {t('print-quote')}
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <KiboTextBox
            label={t('quote-name')}
            value=""
            placeholder={t('enter-quote-name')}
            autoComplete="off"
            // onChange={handleSearch}
            required
          />
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: { md: 'flex', xs: 'block' } }}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ margin: '0 1rem 1rem 0' }}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('quote-number')}
              </InputLabel>
              <Typography>{quoteNumber}</Typography>
            </Box>
            <Box sx={{ margin: '0 1rem 1rem 0' }}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('status')}
              </InputLabel>
              <Typography>{quoteStatus}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ margin: '0 1rem 1rem 0' }}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('account-name')}
              </InputLabel>
              <Typography>{accountName}</Typography>
            </Box>
            <Box sx={{ margin: '0 1rem 1rem 0' }}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('created-by')}
              </InputLabel>
              <Typography>{createdBy}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ margin: '0 1rem 1rem 0' }}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('date-created')}
              </InputLabel>
              <Typography>{createDate}</Typography>
            </Box>
            <Box sx={{ margin: '0 1rem 1rem 0' }}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('expiration-date')}
              </InputLabel>
              <Typography>{expirationDate}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h2" mb={2}>
            {t('quote-summary')}
          </Typography>
          <B2BProductSearch onAddProduct={handleAddProduct} />
        </Grid>
        {/* <Grid item xs={12}>
          <Stack gap={3}>
            {mdScreen ? (
              <B2BProductDetailsTable
                items={cartItems as CrCartItem[]}
                fulfillmentLocations={fulfillmentLocations}
                purchaseLocation={purchaseLocation}
                onFulfillmentOptionChange={onFulfillmentOptionChange}
                onQuantityUpdate={handleQuantityUpdate}
                onStoreSetOrUpdate={handleProductPickupLocation}
                onItemDelete={handleDeleteItem}
              />
            ) : (
              <Stack spacing={2}>
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
                  <Typography variant="body1" sx={createNewQuoteTemplateStyles.noCartItems}>
                    {t('search-to-add-products')}
                  </Typography>
                )}
              </Stack>
            )}

            {!mdScreen && cartItems.length ? (
              <Box paddingY={1} display="flex" flexDirection={'column'} gap={2}>
                <Button variant="contained" color="primary" fullWidth>
                  {t('submit-for-approval')}
                </Button>
                <Box display="flex" gap={3}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ padding: '0.375rem 0.5rem' }}
                  >
                    {t('clear-changes')}
                  </Button>
                  <Button variant="contained" color="inherit" fullWidth>
                    {t('save-and-exit')}
                  </Button>
                </Box>
              </Box>
            ) : null}
          </Stack>
        </Grid> */}
      </Grid>
    </>
  )
}

export default CreateNewQuoteTemplate
