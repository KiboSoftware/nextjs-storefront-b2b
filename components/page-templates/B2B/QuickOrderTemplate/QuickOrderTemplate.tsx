import React from 'react'

import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import { Stack, Typography, Box, Button } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { quickOrderTemplateStyles } from './QuickOrderTemplate.style'
import B2BProductSearch from '@/components/b2b/B2BProductSearch/B2BProductSearch'
import { useProductCardActions } from '@/hooks'
import { FulfillmentOptions as FulfillmentOptionsConstant } from '@/lib/constants'
import { productGetters } from '@/lib/getters'

const QuickOrderTemplate = (props: any) => {
  const { t } = useTranslation('common')
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
      handleAddToCart(payload)
    } else {
      openProductQuickViewModal(product)
    }
  }

  return (
    <Box px={1} py={2}>
      <Stack>
        <Stack
          sx={{ ...quickOrderTemplateStyles.wrapIcon }}
          direction="row"
          gap={2}
          onClick={() => null}
        >
          <ArrowBackIos fontSize="inherit" sx={{ ...quickOrderTemplateStyles.wrapIcon }} />
          <Typography variant="body2">{t('my-account')}</Typography>
        </Stack>

        <Stack sx={{ py: '1.2rem' }} direction="row" justifyContent="space-between">
          <Typography variant="h1">{t('quick-order')}</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="secondary">
              {t('initiate-quote')}
            </Button>
            <Button variant="contained" color="primary">
              {t('checkout')}
            </Button>
          </Stack>
        </Stack>
        <Stack>
          <B2BProductSearch onAddProduct={handleAddProduct} />
        </Stack>
      </Stack>
    </Box>
  )
}

export default QuickOrderTemplate
