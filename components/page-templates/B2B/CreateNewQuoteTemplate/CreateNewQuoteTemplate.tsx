import React, { useState } from 'react'

import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import { LoadingButton } from '@mui/lab'
import { Stack, Typography, Box, Grid, useMediaQuery, Theme, InputLabel } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { createNewQuoteTemplateStyles } from './CreateNewQuoteTemplate.style'
import { B2BProductDetailsTable, B2BProductSearch } from '@/components/b2b'
import { CartItemList } from '@/components/cart'
import { KiboTextBox } from '@/components/common'
import { useAuthContext } from '@/context'
import {
  useGetPurchaseLocation,
  useGetStoreLocations,
  useProductCardActions,
  useGetB2BUserQueries,
  useDeleteQuoteItem,
} from '@/hooks'
import { FulfillmentOptions as FulfillmentOptionsConstant } from '@/lib/constants'
import { orderGetters, productGetters, quoteGetters } from '@/lib/getters'

import { CrOrderItem, Location, Quote } from '@/lib/gql/types'

export interface CreateNewQuoteTemplateProps {
  quote: Quote
  onAccountTitleClick: () => void
}

const CreateNewQuoteTemplate = (props: CreateNewQuoteTemplateProps) => {
  const { quote, onAccountTitleClick } = props
  const { t } = useTranslation('common')
  const mdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const { user } = useAuthContext()

  const { data } = useGetB2BUserQueries({
    accountId: user?.id as number,
    filter: `userId eq ${quote?.userId}`,
  })
  const quoteNumber = quoteGetters.getNumber(quote)
  const quoteStatus = quoteGetters.getStatus(quote)
  const createDate = quoteGetters.getQuoteCreateDate(quote)
  const expirationDate = quoteGetters.getQuoteExpirationData(quote) ?? '-'
  const accountName = user?.companyOrOrganization
  const createdBy = (data?.items?.[0]?.firstName + ' ' + data?.items?.[0]?.lastName) as string
  const quoteItems = quote?.items
  const quoteId = quoteGetters.getQuoteId(quote)

  const locationCodes = orderGetters.getFulfillmentLocationCodes(quoteItems as any)
  const { data: locations } = useGetStoreLocations({ filter: locationCodes })
  const fulfillmentLocations = locations && Object.keys(locations).length ? locations : []

  const { deleteQuoteItem } = useDeleteQuoteItem()
  const updateMode = 'ApplyToDraft'

  const { data: purchaseLocation } = useGetPurchaseLocation()
  const { openProductQuickViewModal, handleAddToQuote } = useProductCardActions()

  const addItemToQuote = async (
    quoteId: string,
    updateMode: string,
    product: any,
    quantity: number
  ) => {
    handleAddToQuote(quoteId, updateMode, product, quantity)
  }

  const handleAddProduct = (product: any) => {
    if (productGetters.isVariationProduct(product)) {
      const dialogProps = {
        title: t('product-configuration-options'),
        cancel: t('cancel'),
        addItemToQuote: t('add-item-to-quote'),
        isB2B: true,
      }
      const quoteDetails = {
        quoteId: quoteId,
        updateMode: updateMode,
      }
      openProductQuickViewModal(product, dialogProps, quoteDetails)
    } else {
      const productData = {
        productCode: productGetters.getProductId(product),
        variationProductCode: productGetters.getVariationProductCode(product),
        fulfillmentMethod: FulfillmentOptionsConstant.SHIP,
        purchaseLocationCode: '',
      }
      addItemToQuote(quoteId, updateMode, productData, 1)
    }
  }
  const handleDeleteItem = async (quoteItemId: string) => {
    await deleteQuoteItem.mutateAsync({ quoteItemId, quoteId, updateMode })
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
              <LoadingButton variant="contained" color="secondary">
                {t('clear-changes')}
              </LoadingButton>
              <LoadingButton variant="contained" color="inherit">
                {t('save-and-exit')}
              </LoadingButton>
              <LoadingButton variant="contained" color="primary">
                {t('submit-for-approval')}
              </LoadingButton>
            </Stack>
          ) : null}
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h2" mb={2}>
            {t('quote-details')}
          </Typography>
          <LoadingButton variant="contained" color="secondary">
            {t('print-quote')}
          </LoadingButton>
        </Grid>
        <Grid item xs={12} md={5}>
          <KiboTextBox
            label={t('quote-name')}
            value=""
            placeholder={t('enter-quote-name')}
            autoComplete="off"
            // onChange={handleSearch}
            required
          />
        </Grid>
        <Grid item xs={12} md={8} sx={{ display: { md: 'flex', xs: 'block' } }}>
          <Grid container rowSpacing={1} columnSpacing={{ md: 1 }}>
            <Grid item xs={6} md={2}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('quote-number')}
              </InputLabel>
              <Typography>{quoteNumber}</Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('status')}
              </InputLabel>
              <Typography>{quoteStatus}</Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('account-name')}
              </InputLabel>
              <Typography>{accountName}</Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('created-by')}
              </InputLabel>
              <Typography>{createdBy}</Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('date-created')}
              </InputLabel>
              <Typography>{createDate}</Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('expiration-date')}
              </InputLabel>
              <Typography>{expirationDate}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h2" mb={2}>
            {t('quote-summary')}
          </Typography>
          <B2BProductSearch onAddProduct={handleAddProduct} />
        </Grid>
        <Grid item xs={12}>
          <Stack gap={3}>
            {mdScreen ? (
              <B2BProductDetailsTable
                items={quoteItems as CrOrderItem[]}
                fulfillmentLocations={fulfillmentLocations}
                purchaseLocation={purchaseLocation}
                onFulfillmentOptionChange={() => null}
                onQuantityUpdate={() => null}
                onStoreSetOrUpdate={() => null}
                onItemDelete={handleDeleteItem}
              />
            ) : (
              <Stack spacing={2}>
                {quoteItems && quoteItems?.length > 0 ? (
                  <CartItemList
                    cartItems={quoteItems as CrOrderItem[]}
                    fulfillmentLocations={fulfillmentLocations as Location[]}
                    purchaseLocation={purchaseLocation}
                    onCartItemDelete={handleDeleteItem}
                    onCartItemQuantityUpdate={() => null}
                    onFulfillmentOptionChange={() => null}
                    onProductPickupLocation={() => null}
                    onCartItemActionSelection={() => null}
                  />
                ) : (
                  <Typography variant="body1" sx={createNewQuoteTemplateStyles.noCartItems}>
                    {t('search-to-add-products')}
                  </Typography>
                )}
              </Stack>
            )}

            {!mdScreen && quoteItems?.length ? (
              <Box paddingY={1} display="flex" flexDirection={'column'} gap={2}>
                <LoadingButton variant="contained" color="primary" fullWidth>
                  {t('submit-for-approval')}
                </LoadingButton>
                <Box display="flex" gap={3}>
                  <LoadingButton
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ padding: '0.375rem 0.5rem' }}
                  >
                    {t('clear-changes')}
                  </LoadingButton>
                  <LoadingButton variant="contained" color="inherit" fullWidth>
                    {t('save-and-exit')}
                  </LoadingButton>
                </Box>
              </Box>
            ) : null}
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default CreateNewQuoteTemplate
