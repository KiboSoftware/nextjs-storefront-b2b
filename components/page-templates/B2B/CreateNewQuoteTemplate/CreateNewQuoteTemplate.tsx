import React, { useCallback, useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { FiberManualRecord } from '@mui/icons-material'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import { LoadingButton } from '@mui/lab'
import {
  Stack,
  Typography,
  Box,
  Grid,
  useMediaQuery,
  Theme,
  InputLabel,
  Button,
  Checkbox,
  FormControlLabel,
  useTheme,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { createNewQuoteTemplateStyles } from './CreateNewQuoteTemplate.style'
import { B2BProductDetailsTable, B2BProductSearch, ShippingInformation } from '@/components/b2b'
import { CartItemList } from '@/components/cart'
import { ShippingMethod } from '@/components/checkout'
import { AddressCard, AddressForm, KiboRadio, KiboTextBox } from '@/components/common'
import { ConfirmationDialog } from '@/components/dialogs'
import { useAuthContext, useModalContext } from '@/context'
import {
  useGetPurchaseLocation,
  useGetStoreLocations,
  useProductCardActions,
  useGetB2BUserQueries,
  useDeleteQuoteItem,
  useGetCustomerAddresses,
  useGetQuoteShippingMethods,
  useValidateCustomerAddress,
  useUpdateQuoteFulfillmentInfo,
  useCreateCustomerAddress,
} from '@/hooks'
import { useQuoteActions } from '@/hooks/custom/useQuoteActions/useQuoteActions'
import { useUpdateQuote } from '@/hooks/mutations/quotes/useUpdateQuote/useUpdateQuote'
import {
  AddressType,
  DefaultId,
  FulfillmentOptions as FulfillmentOptionsConstant,
} from '@/lib/constants'
import { orderGetters, productGetters, quoteGetters, userGetters } from '@/lib/getters'
import { buildAddressParams } from '@/lib/helpers'
import { Address } from '@/lib/types'

import {
  CrContact,
  CrOrderItem,
  CuAddress,
  CustomerContact,
  Location,
  Quote,
} from '@/lib/gql/types'
export interface CreateNewQuoteTemplateProps {
  quote: Quote
  mode?: string
  onAccountTitleClick: () => void
}

const schema = yup.object().shape({
  name: yup.string().required('This field is required'),
})

const CreateNewQuoteTemplate = (props: CreateNewQuoteTemplateProps) => {
  const theme = useTheme()
  const statusColorCode: any = {
    Pending: theme.palette.action.disabled,
    InReview: theme.palette.warning.main,
    ReadyForCheckout: theme.palette.info.main,
    Completed: theme.palette.success.main,
    Expired: theme.palette.error.main,
  }
  const { quote, mode, onAccountTitleClick } = props
  const { showModal } = useModalContext()
  const { t } = useTranslation('common')
  const updateMode = 'ApplyToDraft'
  const draft = true
  const mdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const { user, isAuthenticated } = useAuthContext()

  const accountName = user?.companyOrOrganization ?? '-'
  const { number, quoteId, status, createdDate, expirationDate } =
    quoteGetters.getQuoteDetails(quote)
  const quoteItems = (quote?.items as CrOrderItem[]) ?? []

  const { data } = useGetB2BUserQueries({
    accountId: user?.id as number,
    filter: `userId eq ${quote?.userId}`,
  })
  const createdBy =
    data?.items?.[0]?.firstName || data?.items?.[0]?.lastName
      ? data?.items?.[0]?.firstName + ' ' + data?.items?.[0]?.lastName
      : '-'
  const quoteName = quote?.name || ''
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(schema),
    shouldFocusError: true,
  })
  const getStatusColorCode = useCallback((status: string) => {
    return statusColorCode[status]
  }, [])

  const locationCodes = orderGetters.getFulfillmentLocationCodes(quoteItems as any)
  const { data: locations } = useGetStoreLocations({ filter: locationCodes })
  const fulfillmentLocations = locations && Object.keys(locations).length ? locations : []

  const { deleteQuoteItem } = useDeleteQuoteItem()
  const { updateQuote } = useUpdateQuote()
  const router = useRouter()
  const { data: purchaseLocation } = useGetPurchaseLocation()
  const { openProductQuickViewModal, handleAddToQuote } = useProductCardActions()
  const { handleQuantityUpdate, handleProductPickupLocation, onFulfillmentOptionChange } =
    useQuoteActions({
      quoteId,
      updateMode,
      quoteItems,
      purchaseLocation,
    })
  const { createCustomerAddress } = useCreateCustomerAddress()
  const { validateCustomerAddress } = useValidateCustomerAddress()

  const addItemToQuote = async (
    quoteId: string,
    updateMode: string,
    product: any,
    quantity: number
  ) => {
    handleAddToQuote(quoteId, updateMode, product, quantity)
  }
  const [validateForm, setValidateForm] = useState<boolean>(false)
  const [isNewAddressAdded, setIsNewAddressAdded] = useState<boolean>(false)
  const [isAddressFormValid, setIsAddressFormValid] = useState<boolean>(false)
  const [isAddressSavedToAccount, setIsAddressSavedToAccount] = useState<boolean>(false)
  const { data: addressCollection } = useGetCustomerAddresses(user?.id as number)
  const quoteShippingContact = quoteGetters.getQuoteShippingContact(quote)
  const shipItems = quoteGetters.getQuoteShipItems(quote)
  const pickupItems = quoteGetters.getQuotePickupItems(quote)
  const selectedShippingMethodCode = quoteGetters.getQuoteShippingMethodCode(quote)
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<number>(
    quoteShippingContact?.id as number
  )
  const { updateQuoteFulfillmentInfo } = useUpdateQuoteFulfillmentInfo()
  const { data: shippingMethods } = useGetQuoteShippingMethods(
    quoteId,
    draft,
    isNewAddressAdded,
    selectedShippingAddressId
  )

  const userShippingAddress = isAuthenticated
    ? userGetters.getUserShippingAddress(addressCollection?.items as CustomerContact[])
    : []

  const [savedShippingAddresses, setSavedShippingAddresses] = useState<
    CustomerContact[] | undefined
  >(
    userGetters.getAllShippingAddresses(
      quoteShippingContact,
      userShippingAddress as CustomerContact[]
    )
  )
  const showPreviouslySavedAddress = savedShippingAddresses?.length
  const [shouldShowAddAddressButton, setShouldShowAddAddressButton] = useState<boolean>(
    Boolean(savedShippingAddresses?.length)
  )
  const defaultShippingAddress = userGetters.getDefaultShippingAddress(
    savedShippingAddresses as CustomerContact[]
  )
  const previouslySavedShippingAddress = userGetters.getOtherShippingAddress(
    savedShippingAddresses as CustomerContact[],
    defaultShippingAddress?.id as number
  )

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
    try {
      showModal({
        Component: ConfirmationDialog,
        props: {
          onConfirm: () => {
            deleteQuoteItem.mutate({ quoteItemId, quoteId, updateMode })
          },
          title: t('remove-item'),
          contentText: t('remove-quote-item-confirmation'),
          primaryButtonText: t('remove-quote-item'),
          showContentTopDivider: true,
          showContentBottomDivider: true,
        },
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddNewAddress = () => {
    setValidateForm(false)
    setIsNewAddressAdded(false)
    setShouldShowAddAddressButton(false)
  }

  const handleFormStatusChange = (status: boolean) => setIsAddressFormValid(status)
  const handleAddressValidationAndSave = () => setValidateForm(true)

  const handleSaveQuoteName = async (formData: any) => {
    const { name } = formData
    await updateQuote.mutateAsync({ quoteId, name, updateMode })
  }

  const handleEditQuote = (quoteId: string) => {
    router.push(`/my-account/quote/${quoteId}?mode=edit`)
  }
  const handleSaveAddressToQuote = async ({ contact }: { contact: CrContact }) => {
    try {
      await validateCustomerAddress.mutateAsync({
        addressValidationRequestInput: { address: contact?.address as CuAddress },
      })
      if (isAddressSavedToAccount) {
        await handleSaveAddressToAccount(contact)
      }
      await updateQuoteFulfillmentInfo.mutateAsync({
        quote,
        quoteId,
        contact: { ...contact, id: contact.id || DefaultId.ADDRESSID },
        updateMode,
      })
      setSelectedShippingAddressId((contact?.id as number) || DefaultId.ADDRESSID)
      setShouldShowAddAddressButton(true)
      setValidateForm(false)
      setIsNewAddressAdded(true)
    } catch (error: any) {
      setValidateForm(false)
      console.error(error)
    }
  }

  const handleAddressSelect = (addressId: string) => {
    const selectedAddress = savedShippingAddresses?.find(
      (address) => address?.id === Number(addressId)
    )
    if (selectedAddress?.id) {
      const contact: CrContact = {
        id: selectedAddress?.id,
        firstName: selectedAddress?.firstName || '',
        lastNameOrSurname: selectedAddress?.lastNameOrSurname || '',
        middleNameOrInitial: selectedAddress?.middleNameOrInitial || '',
        email: selectedAddress?.email || '',
        address: {
          ...(selectedAddress?.address as any),
        },
        phoneNumbers: {
          ...(selectedAddress?.phoneNumbers as any),
        },
      }
      handleSaveAddressToQuote({ contact })
    }
  }
  const handleSaveShippingMethod = async (shippingMethodCode: string) => {
    const shippingMethodName = shippingMethods.find(
      (method) => method.shippingMethodCode === shippingMethodCode
    )?.shippingMethodName as string

    try {
      await updateQuoteFulfillmentInfo.mutateAsync({
        quote,
        quoteId,
        updateMode,
        contact: undefined,
        email: undefined,
        shippingMethodCode,
        shippingMethodName,
      })
      // shippingAddressRef.current &&
      //   (shippingAddressRef.current as Element).scrollIntoView({
      //     behavior: 'smooth',
      //     block: 'start',
      //   })
    } catch (error) {
      console.error(error)
    }
  }

  const handleSaveAddressToAccount = async (contact: CrContact) => {
    const address = {
      contact: {
        ...contact,
        email: user?.emailAddress as string,
      },
    } as Address

    const params = buildAddressParams({
      accountId: user?.id as number,
      address,
      isDefaultAddress: false,
      addressType: AddressType.SHIPPING,
    })

    await createCustomerAddress.mutateAsync(params)
    setIsAddressSavedToAccount(false)
  }

  useEffect(() => {
    setSavedShippingAddresses(
      userGetters.getAllShippingAddresses(
        quoteShippingContact,
        userShippingAddress as CustomerContact[]
      )
    )
  }, [JSON.stringify(quoteShippingContact), JSON.stringify(userShippingAddress), isNewAddressAdded])

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
                {mode === 'create' ? (
                  <Typography variant="h2" sx={createNewQuoteTemplateStyles.createNewQuoteText}>
                    {t('create-a-quote')}
                  </Typography>
                ) : (
                  <Typography variant="h2" sx={createNewQuoteTemplateStyles.createNewQuoteText}>
                    {quoteName}
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </Grid>
        {mdScreen && (
          <Grid item xs={12} sm={6}>
            <Box>
              {mode === 'create' ? (
                <Typography variant="h1">{t('create-a-quote')}</Typography>
              ) : (
                <Typography variant="h1">{quoteName}</Typography>
              )}
            </Box>
          </Grid>
        )}
        <Grid item sm={6} display={'flex'} justifyContent={'flex-end'}>
          {mdScreen ? (
            <Stack direction="row" gap={2}>
              {(mode === 'create' || mode === 'edit') && (
                <LoadingButton
                  variant="contained"
                  color="secondary"
                  disabled={status?.toLowerCase() === 'inreview'}
                >
                  {t('clear-changes')}
                </LoadingButton>
              )}
              {!mode && (
                <LoadingButton
                  variant="contained"
                  color="secondary"
                  disabled={status?.toLowerCase() === 'inreview'}
                  onClick={() => handleEditQuote(quoteId)}
                >
                  {t('edit-quote')}
                </LoadingButton>
              )}
              <LoadingButton
                variant="contained"
                color="inherit"
                disabled={status?.toLowerCase() === 'inreview'}
                onClick={handleSubmit(handleSaveQuoteName)}
              >
                {t('save-and-exit')}
              </LoadingButton>
              {(status?.toLowerCase() !== 'readyforcheckout' || mode === 'edit') && (
                <LoadingButton
                  variant="contained"
                  color="primary"
                  disabled={status?.toLowerCase() === 'inreview'}
                >
                  {t('submit-for-approval')}
                </LoadingButton>
              )}
              {status?.toLowerCase() === 'readyforcheckout' && (
                <LoadingButton
                  variant="contained"
                  color="primary"
                  disabled={status?.toLowerCase() === 'inreview'}
                >
                  {t('continue-to-checkout')}
                </LoadingButton>
              )}
            </Stack>
          ) : null}
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            ...createNewQuoteTemplateStyles.quoteDetailsHeading,
            ...createNewQuoteTemplateStyles.gridPaddingTop,
          }}
        >
          <Typography variant="h2" mb={2}>
            {t('quote-details')}
          </Typography>
          <LoadingButton variant="contained" color="secondary">
            {t('print-quote')}
          </LoadingButton>
        </Grid>
        <Grid item xs={12} md={5} style={{ paddingTop: !mdScreen ? '1rem' : '24px' }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <KiboTextBox
                {...field}
                defaultValue={'quoteName'}
                value={field.value || ''}
                label={t('quote-name')}
                placeholder={t('enter-quote-name')}
                autoComplete="off"
                ref={null}
                onChange={(_name: string, value: string) => field.onChange(value)}
                onBlur={field.onBlur}
                required
                disabled={status?.toLocaleLowerCase() === 'inreview'}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            ...createNewQuoteTemplateStyles.quoteDetails,
            ...createNewQuoteTemplateStyles.gridPaddingTop,
          }}
        >
          <Grid container rowSpacing={1} columnSpacing={{ md: 1 }}>
            <Grid item xs={6} md={2}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('quote-number')}
              </InputLabel>
              <Typography>{number}</Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <InputLabel shrink={true} sx={{ position: 'relative' }}>
                {t('status')}
              </InputLabel>
              <Box display={'flex'} gap={1} data-testid={`quote-status`}>
                <FiberManualRecord fontSize="small" color={getStatusColorCode(status)} />
                <Typography variant="body2">{status}</Typography>
              </Box>
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
              <Typography>{createdDate}</Typography>
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
          {mode && status?.toLowerCase() !== 'inreview' && (
            <B2BProductSearch onAddProduct={handleAddProduct} />
          )}
        </Grid>
        <Grid item xs={12} sx={{ ...createNewQuoteTemplateStyles.gridPaddingTop }}>
          <Stack gap={3}>
            {mdScreen ? (
              <B2BProductDetailsTable
                items={quoteItems}
                fulfillmentLocations={fulfillmentLocations}
                purchaseLocation={purchaseLocation}
                status={status}
                mode={mode}
                onFulfillmentOptionChange={onFulfillmentOptionChange}
                onQuantityUpdate={handleQuantityUpdate}
                onStoreSetOrUpdate={handleProductPickupLocation}
                onItemDelete={handleDeleteItem}
              />
            ) : (
              <Stack spacing={2}>
                {quoteItems && quoteItems?.length > 0 ? (
                  <CartItemList
                    cartItems={quoteItems}
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

            <>
              <Typography variant="h2">{t('shipping-information')}</Typography>
              {shouldShowAddAddressButton && (
                <>
                  <Stack gap={2} width="100%">
                    {defaultShippingAddress && (
                      <>
                        <Typography variant="h4" fontWeight={'bold'}>
                          {t('your-default-shipping-address')}
                        </Typography>
                        <KiboRadio
                          radioOptions={[
                            {
                              value: String(defaultShippingAddress.id),
                              name: String(defaultShippingAddress.id),
                              optionIndicator: t('primary'),
                              label: (
                                <AddressCard
                                  firstName={defaultShippingAddress?.firstName as string}
                                  middleNameOrInitial={
                                    defaultShippingAddress?.middleNameOrInitial as string
                                  }
                                  lastNameOrSurname={
                                    defaultShippingAddress?.lastNameOrSurname as string
                                  }
                                  address1={defaultShippingAddress?.address?.address1 as string}
                                  address2={defaultShippingAddress?.address?.address2 as string}
                                  cityOrTown={defaultShippingAddress?.address?.cityOrTown as string}
                                  stateOrProvince={
                                    defaultShippingAddress?.address?.stateOrProvince as string
                                  }
                                  postalOrZipCode={
                                    defaultShippingAddress?.address?.postalOrZipCode as string
                                  }
                                />
                              ),
                            },
                          ]}
                          selected={selectedShippingAddressId?.toString()}
                          align="flex-start"
                          onChange={handleAddressSelect}
                        />
                      </>
                    )}
                    {showPreviouslySavedAddress && (
                      <>
                        <Typography variant="h4" fontWeight={'bold'}>
                          {t('previously-saved-shipping-addresses')}
                        </Typography>
                        <KiboRadio
                          radioOptions={previouslySavedShippingAddress?.map((address, index) => {
                            return {
                              value: String(address.id),
                              name: String(address.id),
                              label: (
                                <AddressCard
                                  firstName={address?.firstName as string}
                                  middleNameOrInitial={address?.middleNameOrInitial as string}
                                  lastNameOrSurname={address?.lastNameOrSurname as string}
                                  address1={address?.address?.address1 as string}
                                  address2={address?.address?.address2 as string}
                                  cityOrTown={address?.address?.cityOrTown as string}
                                  stateOrProvince={address?.address?.stateOrProvince as string}
                                  postalOrZipCode={address?.address?.postalOrZipCode as string}
                                />
                              ),
                            }
                          })}
                          selected={selectedShippingAddressId?.toString()}
                          align="flex-start"
                          onChange={handleAddressSelect}
                        />
                      </>
                    )}
                    <Button
                      variant="contained"
                      color="inherit"
                      sx={{ width: { xs: '100%', sm: '50%' } }}
                      onClick={handleAddNewAddress}
                    >
                      {t('add-new-address')}
                    </Button>
                  </Stack>
                  {shippingMethods.length > 0 && (
                    <ShippingMethod
                      shipItems={shipItems}
                      pickupItems={pickupItems}
                      orderShipmentMethods={[...shippingMethods]}
                      selectedShippingMethodCode={selectedShippingMethodCode}
                      onShippingMethodChange={handleSaveShippingMethod}
                      // onStoreLocatorClick={handleStoreLocatorClick}
                    />
                  )}
                </>
              )}
              {!shouldShowAddAddressButton && (
                <>
                  <AddressForm
                    isUserLoggedIn={false}
                    saveAddressLabel={t('save-shipping-address')}
                    setAutoFocus={true}
                    validateForm={validateForm}
                    onSaveAddress={handleSaveAddressToQuote}
                    onFormStatusChange={handleFormStatusChange}
                  />
                  {isAuthenticated && (
                    <FormControlLabel
                      label={t('save-address-to-account')}
                      control={
                        <Checkbox
                          sx={{ marginLeft: '0.5rem' }}
                          inputProps={{
                            'aria-label': t('save-address-to-account'),
                          }}
                          onChange={() => setIsAddressSavedToAccount(!isAddressSavedToAccount)}
                        />
                      }
                    />
                  )}
                  <Box m={1} maxWidth={'872px'} data-testid="address-form">
                    <Grid container>
                      <Grid item xs={6} gap={2} display={'flex'} direction={'column'}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => setShouldShowAddAddressButton(true)}
                        >
                          {t('cancel')}
                        </Button>
                        <Button
                          variant="contained"
                          color="inherit"
                          style={{ textTransform: 'none' }}
                          onClick={handleAddressValidationAndSave}
                          {...(!isAddressFormValid && { disabled: true })}
                        >
                          {t('save-shipping-address')}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default CreateNewQuoteTemplate
