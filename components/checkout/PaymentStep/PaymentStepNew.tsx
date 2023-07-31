import React, { useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import Help from '@mui/icons-material/Help'
import {
  Stack,
  Checkbox,
  FormControlLabel,
  styled,
  Radio,
  FormControl,
  RadioGroup,
  Typography,
  Button,
  Box,
  Tooltip,
} from '@mui/material'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'
import { useReCaptcha } from 'next-recaptcha-v3'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { CardDetailsForm, PurchaseOrderForm } from '@/components/checkout'
import {
  AddressForm,
  KiboTextBox,
  KiboRadio,
  PaymentBillingCard,
  AddressCard,
  KeyValueDisplay,
} from '@/components/common'
import { useCheckoutStepContext, STEP_STATUS, useAuthContext, useSnackbarContext } from '@/context'
import {
  useGetCards,
  useGetCustomerAddresses,
  useGetCustomerPurchaseOrderAccount,
  usePaymentTypes,
  useValidateCustomerAddress,
} from '@/hooks'
import { CurrencyCode, PaymentType, PaymentWorkflow } from '@/lib/constants'
import { addressGetters, cardGetters, orderGetters, userGetters } from '@/lib/getters'
import {
  buildCardPaymentActionForCheckoutParams,
  buildPurchaseOrderPaymentActionForCheckoutParams,
  tokenizeCreditCardPayment,
  validateGoogleReCaptcha,
} from '@/lib/helpers'
import type {
  Address,
  CardForm,
  ContactForm,
  SavedCard,
  TokenizedCard,
  PaymentAndBilling,
  CardTypeForCheckout,
  SavedBillingAddress,
} from '@/lib/types'

import type {
  CrContact,
  CrAddress,
  CrOrder,
  PaymentActionInput,
  Checkout,
  CuAddress,
  CustomerPurchaseOrderPaymentTerm,
  CrPayment,
  CrPurchaseOrderPayment,
} from '@/lib/gql/types'

interface PaymentStepProps {
  checkout: CrOrder | Checkout
  contact?: ContactForm
  isMultiShipEnabled: boolean
  onVoidPayment: (id: string, paymentId: string, paymentAction: PaymentActionInput) => Promise<void>
  onAddPayment: (id: string, paymentAction: PaymentActionInput) => Promise<void>
}

interface PaymentsType {
  id: string
  name: string
}

const StyledHeadings = styled(Typography)(() => ({
  width: '100%',
  paddingLeft: '0.5rem',
  fontWeight: 'bold',
}))

const formControlLabelStyle = {
  backgroundColor: 'grey.100',
  height: '3.313rem',
  width: '100%',
  marginLeft: '0',
  marginBottom: '1.75rem',
  maxWidth: '26.313rem',
}

const radioStyle = {
  color: 'primary',
  '& .Mui-checked': {
    color: 'primary',
  },
}

const initialCardFormData: CardForm = {
  cardNumber: '',
  cardType: '',
  expireMonth: 0,
  expireYear: 0,
  cvv: '',
  isCardDetailsValidated: false,
  isCardInfoSaved: false,
}

const initialPurchaseOrderFormData: any = {
  poNumber: '',
  purchaseOrderPaymentTerms: '',
  isPurchaseOrderFormValidated: false,
}

const initialBillingAddressData: Address = {
  contact: {
    firstName: '',
    lastNameOrSurname: '',
    email: '',
    address: {
      address1: '',
      address2: '',
      cityOrTown: '',
      stateOrProvince: '',
      postalOrZipCode: '',
      countryCode: '',
    },
    phoneNumbers: {
      home: '',
    },
  },
  isSameBillingShippingAddress: false,
  isAddressValid: false,
  isDataUpdated: false,
}

type SavedPODetails = {
  purchaseOrder: CrPurchaseOrderPayment
  billingAddressInfo: SavedBillingAddress
} | null

const PaymentStepNew = (props: PaymentStepProps) => {
  const { checkout, isMultiShipEnabled = false, onVoidPayment, onAddPayment } = props

  const { t } = useTranslation('common')
  const { isAuthenticated, user } = useAuthContext()
  const { loadPaymentTypes } = usePaymentTypes()
  const paymentTypes = loadPaymentTypes()
  const { validateCustomerAddress } = useValidateCustomerAddress()
  // getting saved card and billing details
  const { data: cardsCollection, isSuccess: isCardFetchSuccess } = useGetCards(user?.id as number)
  const { data: addressCollection, isSuccess: isAddressFetchSuccess } = useGetCustomerAddresses(
    user?.id as number
  )
  const {
    stepStatus,
    setStepNext,
    setStepStatusValid,
    setStepStatusComplete,
    setStepStatusIncomplete,
  } = useCheckoutStepContext()

  const { executeRecaptcha } = useReCaptcha()
  const { showSnackbar } = useSnackbarContext()

  const { publicRuntimeConfig } = getConfig()
  const reCaptchaKey = publicRuntimeConfig.recaptcha.reCaptchaKey

  // getting the selected Payment type from checkout.payments
  const selectedPayment = orderGetters.getSelectedPaymentType(checkout)
  const selectedPaymentType = selectedPayment?.paymentType?.toString() || ''

  const [selectedPaymentTypeRadio, setSelectedPaymentTypeRadio] =
    useState<string>(selectedPaymentType)

  const handlePaymentTypeRadioChange = (value: string) => {
    setSelectedPaymentTypeRadio(value)
  }

  const [isAddingNewPayment, setIsAddingNewPayment] = useState<boolean>(false)

  // Purchase Order details
  const handleInitialPODetails: SavedPODetails | null = useMemo(() => {
    return selectedPaymentType === PaymentType.PURCHASEORDER
      ? {
          purchaseOrder: selectedPayment.billingInfo?.purchaseOrder as CrPurchaseOrderPayment,
          billingAddressInfo: {
            contact: selectedPayment.billingInfo?.billingContact as CrContact,
          },
        }
      : null
  }, [selectedPaymentType, selectedPayment])

  const [
    savedPaymentBillingDetailsForPurchaseOrder,
    setSavedPaymentBillingDetailsForPurchaseOrder,
  ] = useState<SavedPODetails | null>(handleInitialPODetails)

  console.log(
    'savedPaymentBillingDetailsForPurchaseOrder',
    savedPaymentBillingDetailsForPurchaseOrder
  )

  const { data: customerPurchaseOrderAccount, isSuccess: isCustomerPurchaseOrderAccount } =
    useGetCustomerPurchaseOrderAccount(user?.id as number)

  const creditLimit = customerPurchaseOrderAccount?.creditLimit || 0
  const availableBalance = customerPurchaseOrderAccount?.availableBalance || 0
  const customerPurchaseOrderPaymentTerms = (
    customerPurchaseOrderAccount?.customerPurchaseOrderPaymentTerms as CustomerPurchaseOrderPaymentTerm[]
  )?.filter(
    (purchaseOrderTerm: CustomerPurchaseOrderPaymentTerm) =>
      purchaseOrderTerm.siteId === checkout.siteId
  )

  const shouldShowPreviouslySavedPaymentsForPurchaseOrder =
    selectedPaymentTypeRadio === PaymentType.PURCHASEORDER &&
    savedPaymentBillingDetailsForPurchaseOrder?.purchaseOrder &&
    !isAddingNewPayment

  console.log(shouldShowPreviouslySavedPaymentsForPurchaseOrder)

  // Credit Card
  const [cardOptions, setCardOptions] = useState<PaymentAndBilling[]>([])
  const [selectedCardRadio, setSelectedCardRadio] = useState('')
  const [isCVVAddedForNewPayment, setIsCVVAddedForNewPayment] = useState<boolean>(false)
  const [cvv, setCvv] = useState<string>('')

  const useDetailsSchema = () => {
    return yup.object().shape({
      cvv: yup
        .string()
        .required(t('cvv-is-required'))
        .matches(/^\d{3,4}$/g, t('invalid-cvv')),
    })
  }

  const defaultCvv = {
    cvv: '',
  }
  const {
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: 'all',
    reValidateMode: 'onBlur',
    defaultValues: defaultCvv,
    resolver: yupResolver(useDetailsSchema()),
    shouldFocusError: true,
  })

  // default card details if payment method is card
  const defaultCustomerAccountCard = userGetters.getDefaultPaymentBillingMethod(cardOptions)

  const shouldShowCardForm =
    selectedPaymentTypeRadio === PaymentType.CREDITCARD &&
    (isAddingNewPayment || cardOptions.length === 0)

  const shouldShowPurchaseOrderForm =
    selectedPaymentTypeRadio === PaymentType.PURCHASEORDER && isAddingNewPayment

  const shouldShowBillingAddressForm = shouldShowCardForm || shouldShowPurchaseOrderForm

  const shouldShowPreviouslySavedCards =
    selectedPaymentTypeRadio === PaymentType.CREDITCARD && cardOptions.length && !isAddingNewPayment

  // Form Data
  const [cardFormDetails, setCardFormDetails] = useState<CardForm>({})

  const handleCardFormData = (cardData: CardForm) => {
    setCardFormDetails({
      ...cardFormDetails,
      ...cardData,
    })

    setCvv(cardData.cvv as string)
  }

  const handleCardFormValidDetails = (isValid: boolean) => {
    setCardFormDetails({ ...cardFormDetails, isCardDetailsValidated: isValid })
  }

  const handleSavePaymentMethodCheckbox = () => {
    setCardFormDetails({
      ...cardFormDetails,
      isCardInfoSaved: !cardFormDetails.isCardInfoSaved,
    })
  }

  // purchase order form values
  const [purchaseOrderFormDetails, setPurchaseOrderFormDetails] = useState<
    CrPurchaseOrderPayment & { isPurchaseOrderFormValidated?: boolean }
  >({})

  const handlePurchaseOrderFormData = (purchaseOrderFormData: any) => {
    setPurchaseOrderFormDetails({
      ...purchaseOrderFormDetails,
      ...purchaseOrderFormData,
    })
  }

  const handlePurchaseOrderFormValidDetails = (isValid: boolean) => {
    setPurchaseOrderFormDetails({
      ...purchaseOrderFormDetails,
      isPurchaseOrderFormValidated: isValid,
    })
  }

  // Address
  const [billingFormAddress, setBillingFormAddress] = useState<Address>(initialBillingAddressData)

  const [validateForm, setValidateForm] = useState<boolean>(false)

  const handleBillingFormAddress = (address: Address) => {
    const updatedAddress = {
      contact: {
        ...address.contact,
        // email: checkout?.email,
      },
      isAddressValid: true,
      isDataUpdated: address.isDataUpdated,
    } as Address
    setBillingFormAddress(updatedAddress)
  }

  const handleBillingFormValidDetails = (isValid: boolean) => {
    setBillingFormAddress({ ...billingFormAddress, isAddressValid: isValid })
  }

  const handleSameAsShippingAddressCheckbox = (value: boolean) => {
    let address = initialBillingAddressData
    if (value) {
      address = {
        contact: (checkout as CrOrder)?.fulfillmentInfo?.fulfillmentContact as ContactForm,
        isSameBillingShippingAddress: value,
      }
    }

    setBillingFormAddress({
      ...address,
      isAddressValid: false,
    })
  }

  const cancelAddingNewPaymentMethod = () => {
    setIsAddingNewPayment(false)
    // setNewPaymentMethod('')
    setBillingFormAddress(initialBillingAddressData)
    // setCardFormDetails(initialCardFormData)
  }

  const handleSaveNewPaymentMethod = async () => {
    setValidateForm(true)
  }

  const handleInitialCardDetailsLoad = () => {
    setStepStatusIncomplete()

    if (!cardsCollection || !addressCollection) return

    // get card and billing address formatted data from server
    const accountPaymentDetails =
      userGetters.getSavedCardsAndBillingDetails(cardsCollection, addressCollection) || []

    // find default payment details from server data
    const defaultCard = userGetters.getDefaultPaymentBillingMethod(accountPaymentDetails)

    // get previously saved checkout payments
    const checkoutPaymentWithNewStatus = orderGetters.getSelectedPaymentType(checkout)

    // if checkoutPayment details are not present in accountPaymentDetails, push it and set it as selected radio
    if (checkoutPaymentWithNewStatus.billingInfo?.paymentType === PaymentType.CREDITCARD) {
      const cardDetails = checkoutPaymentWithNewStatus?.billingInfo?.card
      const billingAddress = checkoutPaymentWithNewStatus?.billingInfo?.billingContact
      Boolean(
        !accountPaymentDetails?.length ||
          !accountPaymentDetails?.some(
            (each) => each.cardInfo?.id === cardDetails?.paymentServiceCardId
          )
      ) &&
        accountPaymentDetails?.push({
          cardInfo: {
            cardNumberPart: cardDetails?.cardNumberPartOrMask as string,
            id: cardDetails?.paymentServiceCardId as string,
            expireMonth: cardDetails?.expireMonth,
            expireYear: cardDetails?.expireYear,
            paymentType: PaymentType.CREDITCARD,
            cardType: cardDetails?.paymentOrCardType as string,
          },
          billingAddressInfo: {
            contact: {
              ...billingAddress,
            },
          },
        })

      setSelectedCardRadio(cardDetails?.paymentServiceCardId as string)
    } else {
      // if defaultCard is available, set as selected radio
      cardGetters.getCardId(defaultCard?.cardInfo) &&
        selectedCardRadio === '' &&
        setSelectedCardRadio(defaultCard.cardInfo?.id as string)
    }

    if (accountPaymentDetails?.length) {
      setCardOptions(accountPaymentDetails)
    }
  }

  // handle saved payment method radio selection to select different payment method
  const handleRadioSavedCardSelection = (value: string) => {
    setStepStatusIncomplete()
    setSelectedCardRadio(value)
    setCvv('')
    setIsCVVAddedForNewPayment(false)
  }

  const handleAddPaymentMethod = () => {
    // setBillingFormAddress(initialBillingAddressData)
    setIsAddingNewPayment(true)
  }

  const handleTokenization = async (card: CardForm) => {
    const pciHost = publicRuntimeConfig?.pciHost
    const apiHost = publicRuntimeConfig?.apiHost as string
    const tokenizedCardResponse: TokenizedCard = await tokenizeCreditCardPayment(
      card,
      pciHost,
      apiHost
    )

    if (!tokenizedCardResponse) return

    setIsAddingNewPayment(false)

    setCardOptions([
      ...cardOptions,
      {
        cardInfo: {
          id: tokenizedCardResponse.id,
          cardNumberPart: tokenizedCardResponse.numberPart,
          paymentType: selectedCardRadio,
          expireMonth: card.expireMonth,
          expireYear: card.expireYear,
          isCardInfoSaved: card.isCardInfoSaved,
          cardType: card.cardType,
        },
        billingAddressInfo: {
          ...billingFormAddress,
          isSameBillingShippingAddress: billingFormAddress.isSameBillingShippingAddress,
        },
      },
    ])

    setSelectedCardRadio(tokenizedCardResponse.id as string)
    setValidateForm(false)
    setIsCVVAddedForNewPayment(true)
  }

  const handlePurchaseOrderValidation = async (purchaseOrderFormData: any) => {
    setIsAddingNewPayment(false)
    setSavedPaymentBillingDetailsForPurchaseOrder({
      purchaseOrder: {
        purchaseOrderNumber: purchaseOrderFormData?.purchaseOrderNumber,
        // paymentTerm:
        //   customerPurchaseOrderPaymentTerms?.length <= 1
        //     ? customerPurchaseOrderPaymentTerms?.[0]
        //     : purchaseOrderFormData?.paymentTerms,
        paymentTerm: purchaseOrderFormData?.paymentTerm,
      },
      billingAddressInfo: {
        ...billingFormAddress,
        isSameBillingShippingAddress: billingFormAddress.isSameBillingShippingAddress,
      },
    })
    setValidateForm(false)
  }

  const handleValidateBillingAddress = async (address: CuAddress) => {
    try {
      await validateCustomerAddress.mutateAsync({
        addressValidationRequestInput: {
          address,
        },
      })
      selectedPaymentTypeRadio === PaymentType.CREDITCARD &&
        handleTokenization({ ...cardFormDetails })
      selectedPaymentTypeRadio === PaymentType.PURCHASEORDER &&
        handlePurchaseOrderValidation({ ...purchaseOrderFormDetails })
    } catch (error) {
      setValidateForm(false)
      console.error(error)
    }
  }

  const submitFormWithRecaptcha = () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }
    executeRecaptcha('enquiryFormSubmit').then(async (gReCaptchaToken: any) => {
      const captcha = await validateGoogleReCaptcha(gReCaptchaToken)

      if (captcha?.status === 'success') {
        await handlePayment()
      } else {
        showSnackbar(captcha.message, 'error')
      }
    })
  }

  const getCardPaymentAction = async () => {
    let paymentActionToBeAdded: PaymentActionInput = {}
    let paymentActionToBeVoided: PaymentActionInput = {}

    const selectedPaymentMethod = cardOptions.find(
      (each) => each?.cardInfo?.id === selectedCardRadio
    )

    const paymentWithNewStatus = orderGetters.getSelectedPaymentType(checkout)

    const {
      cardType,
      expireMonth,
      expireYear,
      isCardInfoSaved,
      paymentType,
      cardNumberPart,
      id,
      cardholderName,
    } = cardGetters.getCardDetails(selectedPaymentMethod?.cardInfo as SavedCard)

    if (!isCVVAddedForNewPayment) {
      await handleTokenization({
        id,
        cardType,
        cvv,
        cardNumber: cardNumberPart,
        cardholderName,
      })
    }

    const cardDetails: CardTypeForCheckout = {
      cardType,
      expireMonth,
      expireYear,
      isCardInfoSaved,
      paymentType,
      paymentWorkflow: PaymentWorkflow.MOZU,
    }

    const tokenizedData: TokenizedCard = {
      id,
      numberPart: cardNumberPart,
    }

    const isSameAsShipping = addressGetters.getIsBillingShippingAddressSame(
      selectedPaymentMethod?.billingAddressInfo
    )

    if (paymentWithNewStatus?.billingInfo?.card?.paymentServiceCardId === selectedCardRadio) {
      setStepStatusComplete()
      setStepNext()
      return
    }

    if (paymentWithNewStatus.billingInfo?.paymentType === PaymentType.CREDITCARD) {
      const card = paymentWithNewStatus?.billingInfo?.card
      cardDetails.cardType = card?.paymentOrCardType as string
      cardDetails.expireMonth = card?.expireMonth as number
      cardDetails.expireYear = card?.expireYear as number
      cardDetails.paymentType = paymentWithNewStatus?.paymentType as string

      paymentActionToBeVoided = buildCardPaymentActionForCheckoutParams(
        CurrencyCode.US,
        checkout,
        cardDetails,
        tokenizedData,
        paymentWithNewStatus?.billingInfo?.billingContact as CrContact,
        isSameAsShipping
      )

      paymentActionToBeVoided = { ...paymentActionToBeVoided, actionName: 'VoidPayment' }
    }

    paymentActionToBeAdded = {
      ...buildCardPaymentActionForCheckoutParams(
        CurrencyCode.US,
        checkout,
        cardDetails,
        tokenizedData,
        selectedPaymentMethod?.billingAddressInfo?.contact as CrContact,
        isSameAsShipping
      ),
      actionName: '',
    }

    return {
      paymentActionToBeAdded,
      paymentActionToBeVoided,
      paymentId: paymentWithNewStatus?.id as string,
    }
  }

  const getPurchaseOrderPaymentAction = () => {
    let paymentActionToBeAdded: PaymentActionInput = {}
    let paymentActionToBeVoided: PaymentActionInput = {}

    let purchaseOrderData: any = {}
    const isSameAsShipping = addressGetters.getIsBillingShippingAddressSame(
      savedPaymentBillingDetailsForPurchaseOrder?.billingAddressInfo
    )
    purchaseOrderData = savedPaymentBillingDetailsForPurchaseOrder?.purchaseOrder || {}

    const paymentsPurchaseOrderWithNewStatus = orderGetters.getSelectedPaymentType(checkout)

    if (paymentsPurchaseOrderWithNewStatus.billingInfo?.paymentType === PaymentType.PURCHASEORDER) {
      const purchaseOrderDataWithNewStatus = {
        purchaseOrderNumber:
          paymentsPurchaseOrderWithNewStatus?.billingInfo?.purchaseOrder?.purchaseOrderNumber,
        purchaseOrderPaymentTerms:
          paymentsPurchaseOrderWithNewStatus?.billingInfo?.purchaseOrder?.paymentTerm,
      }

      paymentActionToBeVoided = buildPurchaseOrderPaymentActionForCheckoutParams(
        CurrencyCode.US,
        checkout,
        purchaseOrderDataWithNewStatus,
        paymentsPurchaseOrderWithNewStatus?.billingInfo?.billingContact as CrContact,
        isSameAsShipping
      )

      paymentActionToBeVoided = { ...paymentActionToBeVoided, actionName: 'VoidPayment' }
      // await onVoidPayment(
      //   checkout?.id as string,
      //   paymentsPurchaseOrderWithNewStatus?.id as string,
      //   paymentActionToBeVoided
      // )
    }

    paymentActionToBeAdded = buildPurchaseOrderPaymentActionForCheckoutParams(
      CurrencyCode.US,
      checkout,
      purchaseOrderData,
      savedPaymentBillingDetailsForPurchaseOrder?.billingAddressInfo?.contact as CrContact,
      isSameAsShipping
    )
    // if (checkout?.id) {
    //   paymentAction = { ...paymentAction, actionName: '' }
    //   await onAddPayment(checkout.id, paymentAction)
    //   setStepStatusComplete()
    //   setStepNext()
    // }

    return {
      paymentActionToBeAdded,
      paymentActionToBeVoided,
      paymentId: paymentsPurchaseOrderWithNewStatus?.id as string,
    }
  }

  const handlePayment = async () => {
    const paymentMethodSelection: any = {
      [PaymentType.PURCHASEORDER]: getPurchaseOrderPaymentAction,
      [PaymentType.CREDITCARD]: getCardPaymentAction,
    }

    const responseForVoid = await paymentMethodSelection[selectedPaymentType]()

    if (!responseForVoid) {
      return
    }

    if (responseForVoid.paymentActionToBeVoided.actionName) {
      await onVoidPayment(
        checkout?.id as string,
        responseForVoid.paymentId,
        responseForVoid.paymentActionToBeVoided
      )
    }

    const responseForAdd = await paymentMethodSelection[selectedPaymentTypeRadio]()

    if (checkout?.id) {
      await onAddPayment(checkout.id, responseForAdd.paymentActionToBeAdded)
      setStepStatusComplete()
      setStepNext()
    }
  }

  useEffect(() => {
    if (selectedPaymentTypeRadio === PaymentType.CREDITCARD) {
      handleInitialCardDetailsLoad()
    }
  }, [selectedPaymentTypeRadio])

  // when payment card and billing address info is available, handleTokenization
  useEffect(() => {
    if (
      (cardFormDetails.isDataUpdated || purchaseOrderFormDetails.isPurchaseOrderFormValidated) &&
      billingFormAddress.isDataUpdated
    ) {
      handleValidateBillingAddress({ ...billingFormAddress.contact.address })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardFormDetails.isDataUpdated, billingFormAddress.isDataUpdated])

  useEffect(() => {
    if (selectedPaymentTypeRadio === PaymentType.CREDITCARD) {
      if (isAddingNewPayment || !cvv || !selectedPaymentTypeRadio) setStepStatusIncomplete()
      else setStepStatusValid()
    } else if (selectedPaymentTypeRadio === PaymentType.PURCHASEORDER) {
      if (isAddingNewPayment || !savedPaymentBillingDetailsForPurchaseOrder)
        setStepStatusIncomplete()
      else setStepStatusValid()
    }
  }, [
    cvv,
    isAddingNewPayment,
    savedPaymentBillingDetailsForPurchaseOrder,
    selectedPaymentTypeRadio,
  ])

  useEffect(() => {
    if (stepStatus === STEP_STATUS.SUBMIT) {
      if (reCaptchaKey) {
        submitFormWithRecaptcha()
      } else {
        handlePayment()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepStatus])

  const isAddPaymentMethodButtonDisabled = () => {
    return !(
      billingFormAddress.isAddressValid &&
      (cardFormDetails.isCardDetailsValidated ||
        purchaseOrderFormDetails.isPurchaseOrderFormValidated)
    )
  }

  return (
    <Stack data-testid="checkout-payment">
      <Typography variant="h2" sx={{ paddingBottom: '1.625rem' }}>
        {t('payment-method')}
      </Typography>

      <FormControl>
        <RadioGroup
          aria-labelledby="payment-types-radio"
          name="radio-buttons-group"
          value={selectedPaymentTypeRadio}
          onChange={(_, value: string) => handlePaymentTypeRadioChange(value)}
          data-testid="payment-types"
        >
          {paymentTypes.map((paymentType: PaymentsType) => {
            return (
              <Box key={paymentType.id}>
                <FormControlLabel
                  sx={{ ...formControlLabelStyle }}
                  value={paymentType.id}
                  control={<Radio sx={{ ...radioStyle }} />}
                  label={paymentType.name}
                />
                {paymentType.id === selectedPaymentTypeRadio ? (
                  <Box sx={{ maxWidth: '100%', marginBottom: '1.75rem' }}>
                    {shouldShowPreviouslySavedCards && (
                      <Stack gap={2} width="100%" data-testid="saved-payment-methods">
                        {cardOptions?.length ? (
                          <>
                            <KiboRadio
                              radioOptions={cardOptions?.map((card) => {
                                const address = addressGetters.getAddress(
                                  card?.billingAddressInfo?.contact.address as CrAddress
                                )
                                return {
                                  value: cardGetters.getCardId(card?.cardInfo),
                                  name: cardGetters.getCardId(card?.cardInfo),
                                  optionIndicator:
                                    defaultCustomerAccountCard.cardInfo?.id === card.cardInfo?.id
                                      ? t('primary')
                                      : '',
                                  label: (
                                    <>
                                      <PaymentBillingCard
                                        cardNumberPart={cardGetters.getCardNumberPart(
                                          card?.cardInfo
                                        )}
                                        expireMonth={cardGetters.getExpireMonth(card?.cardInfo)}
                                        expireYear={cardGetters.getExpireYear(card?.cardInfo)}
                                        cardType={cardGetters
                                          .getCardType(card?.cardInfo)
                                          ?.toUpperCase()}
                                        address1={addressGetters.getAddress1(address)}
                                        address2={addressGetters.getAddress2(address)}
                                        cityOrTown={addressGetters.getCityOrTown(address)}
                                        postalOrZipCode={addressGetters.getPostalOrZipCode(address)}
                                        stateOrProvince={addressGetters.getStateOrProvince(address)}
                                      />
                                      {selectedCardRadio === card?.cardInfo?.id &&
                                        !isCVVAddedForNewPayment && (
                                          <Box pt={2} width={'50%'}>
                                            <FormControl sx={{ width: '100%' }}>
                                              <Controller
                                                name="cvv"
                                                control={control}
                                                defaultValue={defaultCvv?.cvv}
                                                render={({ field }) => {
                                                  return (
                                                    <KiboTextBox
                                                      type="password"
                                                      value={field.value || ''}
                                                      label={t('security-code')}
                                                      placeholder={t('security-code-placeholder')}
                                                      required={true}
                                                      onChange={(_, value) => {
                                                        field.onChange(value)
                                                        setCvv(value)
                                                      }}
                                                      onBlur={field.onBlur}
                                                      error={!!errors?.cvv}
                                                      helperText={
                                                        errors?.cvv?.message as unknown as string
                                                      }
                                                      icon={
                                                        <Box
                                                          pr={1}
                                                          pt={0.5}
                                                          sx={{ cursor: 'pointer' }}
                                                        >
                                                          <Tooltip
                                                            title={t('cvv-tooltip-text')}
                                                            placement="top"
                                                          >
                                                            <Help color="disabled" />
                                                          </Tooltip>
                                                        </Box>
                                                      }
                                                    />
                                                  )
                                                }}
                                              />
                                            </FormControl>
                                          </Box>
                                        )}
                                    </>
                                  ),
                                }
                              })}
                              selected={selectedCardRadio}
                              align="flex-start"
                              onChange={handleRadioSavedCardSelection}
                            />
                          </>
                        ) : (
                          <Typography variant="h4">
                            {t('no-previously-saved-payment-methods')}
                          </Typography>
                        )}
                      </Stack>
                    )}
                    {shouldShowPreviouslySavedPaymentsForPurchaseOrder ? (
                      <Stack gap={2} width="100%" data-testid="saved-payment-methods">
                        {savedPaymentBillingDetailsForPurchaseOrder ? (
                          <>
                            <KeyValueDisplay
                              option={{
                                name: t('po-number'),
                                value:
                                  savedPaymentBillingDetailsForPurchaseOrder?.purchaseOrder
                                    ?.purchaseOrderNumber,
                              }}
                              variant="body1"
                            />
                            <KeyValueDisplay
                              option={{
                                name: t('payment-terms'),
                                value:
                                  savedPaymentBillingDetailsForPurchaseOrder?.purchaseOrder
                                    ?.paymentTerm?.code,
                              }}
                              variant="body1"
                            />
                            <AddressCard
                              address1={addressGetters.getAddress1(
                                savedPaymentBillingDetailsForPurchaseOrder?.billingAddressInfo
                                  ?.contact.address as CrAddress
                              )}
                              address2={addressGetters.getAddress2(
                                savedPaymentBillingDetailsForPurchaseOrder?.billingAddressInfo
                                  ?.contact.address as CrAddress
                              )}
                              cityOrTown={addressGetters.getCityOrTown(
                                savedPaymentBillingDetailsForPurchaseOrder?.billingAddressInfo
                                  ?.contact.address as CrAddress
                              )}
                              postalOrZipCode={addressGetters.getPostalOrZipCode(
                                savedPaymentBillingDetailsForPurchaseOrder?.billingAddressInfo
                                  ?.contact.address as CrAddress
                              )}
                              stateOrProvince={addressGetters.getStateOrProvince(
                                savedPaymentBillingDetailsForPurchaseOrder?.billingAddressInfo
                                  ?.contact.address as CrAddress
                              )}
                            />
                          </>
                        ) : (
                          <Typography variant="h4">
                            {t('no-previously-saved-payment-methods')}
                          </Typography>
                        )}
                      </Stack>
                    ) : null}
                    {shouldShowCardForm ? (
                      <>
                        <CardDetailsForm
                          validateForm={validateForm}
                          onSaveCardData={handleCardFormData}
                          onFormStatusChange={handleCardFormValidDetails}
                        />

                        {isAuthenticated ? (
                          <FormControlLabel
                            sx={{
                              width: '100%',
                              paddingLeft: '0.5rem',
                            }}
                            control={
                              <Checkbox
                                onChange={handleSavePaymentMethodCheckbox}
                                data-testid="save-payment"
                              />
                            }
                            label={`${t('save-payment-method-checkbox')}`}
                          />
                        ) : null}
                      </>
                    ) : null}
                    {shouldShowPurchaseOrderForm ? (
                      <PurchaseOrderForm
                        creditLimit={creditLimit}
                        availableBalance={availableBalance}
                        validateForm={validateForm}
                        purchaseOrderPaymentTerms={customerPurchaseOrderPaymentTerms}
                        onSavePurchaseData={handlePurchaseOrderFormData}
                        onFormStatusChange={handlePurchaseOrderFormValidDetails}
                      />
                    ) : null}
                    {shouldShowBillingAddressForm ? (
                      <>
                        <StyledHeadings variant="h2" sx={{ paddingTop: '3.125rem' }}>
                          {t('billing-address')}
                        </StyledHeadings>
                        {!isMultiShipEnabled && (
                          <FormControlLabel
                            sx={{
                              width: '100%',
                              paddingLeft: '0.5rem',
                            }}
                            control={<Checkbox name={`${t('billing-address-same-as-shipping')}`} />}
                            label={`${t('billing-address-same-as-shipping')}`}
                            onChange={(_, value) => handleSameAsShippingAddressCheckbox(value)}
                          />
                        )}
                        <AddressForm
                          key={selectedPaymentTypeRadio}
                          contact={billingFormAddress.contact}
                          setAutoFocus={false}
                          isUserLoggedIn={isAuthenticated}
                          onSaveAddress={handleBillingFormAddress}
                          validateForm={validateForm}
                          onFormStatusChange={handleBillingFormValidDetails}
                        />
                        <Stack pl={1} gap={2} sx={{ width: { xs: '100%', md: '50%' } }}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={cancelAddingNewPaymentMethod}
                          >
                            {t('cancel')}
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            {...(isAddPaymentMethodButtonDisabled() && { disabled: true })}
                            onClick={handleSaveNewPaymentMethod}
                          >
                            {t('save-payment-method')}
                          </Button>
                        </Stack>
                      </>
                    ) : null}
                    {!(shouldShowPurchaseOrderForm || shouldShowCardForm) ? (
                      <Box pt={2}>
                        <Button
                          variant="contained"
                          color="inherit"
                          sx={{ width: { xs: '100%', sm: '50%' } }}
                          onClick={handleAddPaymentMethod}
                        >
                          {t('add-payment-method')}
                        </Button>
                      </Box>
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            )
          })}
        </RadioGroup>
      </FormControl>
    </Stack>
  )
}

export default PaymentStepNew
