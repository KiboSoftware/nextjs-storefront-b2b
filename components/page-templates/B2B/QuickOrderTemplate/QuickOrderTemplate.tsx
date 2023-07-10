import React from 'react'

import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import { Stack, Typography, Divider, Box, useMediaQuery, useTheme, Button } from '@mui/material'
import { useTranslation } from 'next-i18next'

import QuickOrderProductSearch from '@/components/b2b/quick-order/QuickOrderProductSearch/QuickOrderProductSearch'

import type { CrOrder } from '@/lib/gql/types'

const styles = {
  wrapIcon: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    cursor: 'pointer',
  },
}

const QuickOrderTemplate = (props: any) => {
  const { t } = useTranslation('common')

  return (
    <Box px={1} py={2}>
      <Stack>
        <Stack sx={styles.wrapIcon} direction="row" gap={2} onClick={() => null}>
          <ArrowBackIos fontSize="inherit" sx={styles.wrapIcon} />
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
          <QuickOrderProductSearch />
        </Stack>
      </Stack>
    </Box>
  )
}

export default QuickOrderTemplate
