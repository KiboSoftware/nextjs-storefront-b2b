import React from 'react'

import AccountCircle from '@mui/icons-material/AccountCircle'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
  Grid,
} from '@mui/material'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { MyProfile, PaymentMethod, AddressBook } from '@/components/my-account'
import { useAuthContext } from '@/context'
import {
  useGetCards,
  useGetCustomerAddresses,
  useCreateCustomerCard,
  useUpdateCustomerCard,
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
} from '@/hooks'
import type { BillingAddress, CardType } from '@/lib/types'

import type { CustomerAccount } from '@/lib/gql/types'

const style = {
  accordion: {
    ':before': {
      backgroundColor: 'transparent',
    },
    boxShadow: 0,
    borderRadius: 0,
  },

  accordionDetails: {
    pt: 0,
    p: { md: 0 },
  },
  myAccountChildren: {
    paddingLeft: { md: 0, xs: '1rem' },
    paddingRight: { md: 0, xs: '1rem' },
    marginTop: '0.75rem',
    marginBottom: '0.75rem',
  },
  accordionSummary: {
    padding: { md: 0 },
  },
  expandedIcon: {
    color: 'text.primary',
  },
  orderHistory: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    alignItems: 'center',
  },
  accountCircleBox: {
    display: { xs: 'flex' },
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: { xs: 'center', md: 'start' },
    alignItems: 'center',
    margin: { xs: '1rem', md: '2rem 0' },
  },
  accountCircle: {
    fontSize: {
      md: '2.7rem',
      xs: '3.3rem',
    },
  },
  backButton: {
    typography: 'body2',
    textDecoration: 'none',
    color: 'text.primary',
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 0.5rem',
    cursor: 'pointer',
  },
  divider: {
    height: '1.188rem',
    borderColor: 'transparent',
  },
}

const MyAccountTemplate = () => {
  const { t } = useTranslation('common')
  const { publicRuntimeConfig } = getConfig()
  const isSubscriptionEnabled = publicRuntimeConfig.isSubscriptionEnabled
  const router = useRouter()
  const theme = useTheme()
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'))
  const { user, logout } = useAuthContext()

  const { data: cards } = useGetCards(user?.id as number)
  const { data: contacts } = useGetCustomerAddresses(user?.id as number)

  const { createCustomerCard } = useCreateCustomerCard()
  const { updateCustomerCard } = useUpdateCustomerCard()
  const { createCustomerAddress } = useCreateCustomerAddress()
  const { updateCustomerAddress } = useUpdateCustomerAddress()

  const handleGoToOrderHistory = () => {
    router.push('/my-account/order-history?filters=M-6')
  }

  const handleSave = async (
    address: BillingAddress,
    card: CardType,
    isUpdatingAddress: boolean
  ) => {
    let response

    // Add update address
    if (isUpdatingAddress) {
      response = await updateCustomerAddress.mutateAsync(address)
    } else {
      response = await createCustomerAddress.mutateAsync(address)
    }

    const params = {
      accountId: card.accountId,
      cardId: card.cardId,
      cardInput: card.cardInput,
    }
    params.cardInput.contactId = response.id

    // Add update card
    if (card.cardId) {
      await updateCustomerCard.mutateAsync(params)
    } else {
      await createCustomerCard.mutateAsync(params)
    }
  }

  const accordionData = [
    {
      id: 'my-profile-accordion',
      controls: 'my-profile-content',
      header: t('account-information'),
      component: <MyProfile user={user as CustomerAccount} />,
      path: null,
    },
    {
      id: 'account-hierarchy-accordion',
      controls: 'account-hierarchy-content',
      header: t('account-hierarchy'),
      component: null,
      path: null,
    },
    {
      id: 'users-accordion',
      controls: 'users-content',
      header: t('users'),
      component: null,
      path: '/my-account/users',
    },
    {
      id: 'shipping-information-accordion',
      controls: 'shipping-information-content',
      header: t('shipping-information'),
      component: <AddressBook user={user as CustomerAccount} contacts={contacts} />,
    },
    {
      id: 'payment-information-accordion',
      controls: 'payment-information-content',
      header: t('payment-information'),
      component: (
        <PaymentMethod
          user={user as CustomerAccount}
          cards={cards}
          contacts={contacts}
          onSave={handleSave}
        />
      ),
    },
    {
      id: 'custom-attributes-accordion',
      controls: 'custom-attributes-content',
      header: t('custom-attributes'),
      component: null,
      path: null,
    },
  ]

  return (
    <Grid container>
      <Grid item md={8} xs={12}>
        {!mdScreen && (
          <Link aria-label={t('back')} sx={{ ...style.backButton }} href="/">
            <ChevronLeft />
            {t('back')}
          </Link>
        )}
        <Box sx={{ ...style.accountCircleBox }}>
          <AccountCircle sx={{ ...style.accountCircle }} />
          <Typography
            variant={mdScreen ? 'h1' : 'h2'}
            sx={{ paddingLeft: { md: '0.5rem', xs: 0 } }}
          >
            {t('KiboUSA')}
          </Typography>
        </Box>
        <Box
          sx={{
            display: { md: 'flex', xs: 'block' },
            alignItems: 'center',
            ...style.myAccountChildren,
          }}
        >
          <Typography
            variant={mdScreen ? 'h1' : 'h2'}
            sx={{ paddingLeft: { md: '0.5rem', xs: 0 } }}
          >
            {t('account')}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'grey.500' }} />

        {accordionData.map((data) => {
          return (
            <Box key={data.id}>
              <Accordion disableGutters sx={{ ...style.accordion }}>
                <AccordionSummary
                  onClick={() => data.path && router.push(data.path)}
                  expandIcon={data.component && <ExpandMoreIcon sx={{ ...style.expandedIcon }} />}
                  aria-controls={data.controls}
                  id={data.id}
                  sx={{ ...style.accordionSummary }}
                >
                  <Typography variant="h3">{data.header}</Typography>
                </AccordionSummary>
                {data.component && <AccordionDetails>{data.component}</AccordionDetails>}
              </Accordion>
              <Divider sx={{ borderColor: 'grey.500' }} />
            </Box>
          )
        })}

        <Box sx={{ ...style.myAccountChildren }}>
          <Typography variant={mdScreen ? 'h1' : 'h2'}>{t('orders')}</Typography>
        </Box>

        {/* code for subscription ends here */}

        <Divider sx={{ borderColor: 'grey.500' }} />
        <Box
          sx={{
            ...style.myAccountChildren,
            ...style.orderHistory,
          }}
        >
          <Typography variant="h3">{t('quick-order')}</Typography>
          <ChevronRightIcon />
        </Box>
        <Divider sx={{ borderColor: 'grey.500' }} />
        <Box
          sx={{
            ...style.myAccountChildren,
            ...style.orderHistory,
          }}
          onClick={handleGoToOrderHistory}
        >
          <Typography variant="h3">{t('order-history')}</Typography>
          <ChevronRightIcon />
        </Box>
        <Divider sx={{ borderColor: 'grey.500' }} />
        <Box
          sx={{
            ...style.myAccountChildren,
            ...style.orderHistory,
          }}
        >
          <Typography variant="h3">{t('returns')}</Typography>
          <ChevronRightIcon />
        </Box>
        <Divider sx={{ borderColor: 'grey.500' }} />
        <Box
          sx={{
            ...style.myAccountChildren,
            ...style.orderHistory,
          }}
        >
          <Typography variant="h3">{t('quotes')}</Typography>
          <ChevronRightIcon />
        </Box>
        <Divider sx={{ borderColor: 'grey.500' }} />
        <Box
          sx={{
            ...style.myAccountChildren,
            ...style.orderHistory,
          }}
        >
          <Typography variant="h3">{t('lists')}</Typography>
          <ChevronRightIcon />
        </Box>
        <Divider sx={{ backgroundColor: 'grey.300', ...style.divider }} />
        <Box sx={{ ...style.myAccountChildren, cursor: 'pointer' }} onClick={logout}>
          <Typography variant="h3">{t('logout')}</Typography>
        </Box>
        <Divider sx={{ borderColor: 'grey.500' }} />
      </Grid>
    </Grid>
  )
}

export default MyAccountTemplate
