import React, { useState, useEffect, ChangeEvent } from 'react'

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
} from '@/lib/gql/types'

interface PaymentStepProps {
  checkout: CrOrder | Checkout
  contact?: ContactForm
  isMultiShipEnabled?: boolean
  onVoidPayment: (id: string, paymentId: string, paymentAction: PaymentActionInput) => Promise<void>
  onAddPayment: (id: string, paymentAction: PaymentActionInput) => Promise<void>
}

interface PaymentMethod {
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
}

const PaymentStep = (props: PaymentStepProps) => {
  const { checkout, isMultiShipEnabled, onVoidPayment, onAddPayment } = props

  // hooks
  const { isAuthenticated, user } = useAuthContext()
  const { validateCustomerAddress } = useValidateCustomerAddress()

  const { t } = useTranslation('common')

  const { executeRecaptcha } = useReCaptcha()
  const { showSnackbar } = useSnackbarContext()

  const { publicRuntimeConfig } = getConfig()
  const reCaptchaKey = publicRuntimeConfig.recaptcha.reCaptchaKey

  const { loadPaymentTypes } = usePaymentTypes()
  const paymentMethods = loadPaymentTypes()

  // getting saved card and billing details
  const { data: customerCardsCollection, isSuccess: isCustomerCardsSuccess } = useGetCards(
    user?.id as number
  )

  const { data: customerContactsCollection, isSuccess: isCustomerContactsSuccess } =
    useGetCustomerAddresses(user?.id as number)

  const { data: customerPurchaseOrderAccount, isSuccess: isCustomerPurchaseOrderAccount } =
    useGetCustomerPurchaseOrderAccount(user?.id as number)

  const creditLimit = customerPurchaseOrderAccount?.creditLimit || 0
  const availableBalance = customerPurchaseOrderAccount?.availableBalance || 0
  const purchaseOrderPaymentTerms =
    customerPurchaseOrderAccount?.customerPurchaseOrderPaymentTerms?.filter(
      (purchaseOrderTerm: CustomerPurchaseOrderPaymentTerm) =>
        purchaseOrderTerm.siteId === checkout.siteId
    )
  // checkout context handling
  const {
    stepStatus,
    setStepNext,
    setStepStatusValid,
    setStepStatusComplete,
    setStepStatusIncomplete,
  } = useCheckoutStepContext()

  // states
  const [newPaymentMethod, setNewPaymentMethod] = useState<string>('')
  const [cardFormDetails, setCardFormDetails] = useState<CardForm>(initialCardFormData)
  const [purchaseOrderFormDetails, setPurchaseOrderFormDetails] = useState<any>(
    initialPurchaseOrderFormData
  )

  const [billingFormAddress, setBillingFormAddress] = useState<Address>(initialBillingAddressData)
  const [validateForm, setValidateForm] = useState<boolean>(false)
  const [isAddingNewPayment, setIsAddingNewPayment] = useState<boolean>(false)
  const [isCVVAddedForNewPayment, setIsCVVAddedForNewPayment] = useState<boolean>(false)
  const [selectedPaymentBillingRadio, setSelectedPaymentBillingRadio] = useState('')
  const [savedPaymentBillingDetails, setSavedPaymentBillingDetails] = useState<PaymentAndBilling[]>(
    []
  )
  const [
    savedPaymentBillingDetailsForPurchaseOrder,
    setSavedPaymentBillingDetailsForPurchaseOrder,
  ] = useState<
    {
      purchaseOrder?: any
      billingAddressInfo?: SavedBillingAddress
    }[]
  >([])

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
  const defaultCustomerAccountCard = userGetters.getDefaultPaymentBillingMethod(
    savedPaymentBillingDetails
  )

  // handle saved payment method radio selection to select different payment method
  const handleRadioSavedCardSelection = (value: string) => {
    setStepStatusIncomplete()
    setSelectedPaymentBillingRadio(value)
    setCvv('')
    setIsCVVAddedForNewPayment(false)
  }

  const handleSavePaymentMethodCheckbox = () => {
    setCardFormDetails({
      ...cardFormDetails,
      isCardInfoSaved: !cardFormDetails.isCardInfoSaved,
    })
  }

  const handleCardFormData = (cardData: CardForm) => {
    setCardFormDetails({
      ...cardFormDetails,
      ...cardData,
    })

    setCvv(cardData.cvv as string)
  }

  const handlePurchaseOrderFormData = (purchaseOrderFormData: any) => {
    setPurchaseOrderFormDetails({
      ...purchaseOrderFormDetails,
      ...purchaseOrderFormData,
    })
  }

  const handleSameAsShippingAddressCheckbox = (value: boolean) => {
    let address = initialBillingAddressData
    if (value) {
      address = {
        contact: (checkout as CrOrder)?.fulfillmentInfo?.fulfillmentContact as ContactForm,
      }
    } else if (billingFormAddress.isDataUpdated) {
      address = billingFormAddress
    }

    setBillingFormAddress({
      ...address,
      isAddressValid: true,
      isSameBillingShippingAddress: value,
    })
  }

  const handleBillingFormAddress = (address: Address) => {
    const updatedAddress = {
      contact: {
        ...address.contact,
      },
      email: checkout?.email,
      isAddressValid: true,
      isDataUpdated: address.isDataUpdated,
    } as Address
    setBillingFormAddress(updatedAddress)
  }

  // when adding new payment method, set payment method type (ex: credit card / check)
  const handlePaymentMethodSelection = (event: ChangeEvent<HTMLInputElement>) => {
    setIsAddingNewPayment(true)
    setNewPaymentMethod(event.target.value)
    setBillingFormAddress(initialBillingAddressData)
  }

  const submitFormWithRecaptcha = () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }
    executeRecaptcha('enquiryFormSubmit').then(async (gReCaptchaToken: any) => {
      const captcha = await validateGoogleReCaptcha(gReCaptchaToken)

      if (captcha?.status === 'success') {
        if (newPaymentMethod === PaymentType.CREDITCARD) await saveCardDataToOrder()
        if (newPaymentMethod === PaymentType.PURCHASEORDER) await savePurchaseOrderDataToOrder()
      } else {
        showSnackbar(captcha.message, 'error')
      }
    })
  }

  const shouldShowPreviouslySavedPayments = () => {
    if (Boolean(savedPaymentBillingDetails?.length)) {
      return isAddingNewPayment ? false : true
    }
    return false
  }

  const shouldShowPreviouslySavedPaymentsForPurchaseOrder = () => {
    if (Boolean(savedPaymentBillingDetailsForPurchaseOrder?.length)) {
      return isAddingNewPayment ? false : true
    }
    return false
  }

  const shouldShowPaymentMethodOptions = () => {
    if (!savedPaymentBillingDetails?.length || isAddingNewPayment) return true

    return false
  }

  const showPurchaseOrderForm = () => {
    if (isAddingNewPayment && newPaymentMethod === PaymentType.PURCHASEORDER) {
      return true
    }
    return false
  }

  const shouldShowCardForm = () => {
    if (isAddingNewPayment && newPaymentMethod === PaymentType.CREDITCARD) {
      return true
    }

    return false
  }

  const shouldShowBillingAddressForm = () => {
    if (isAddingNewPayment && Boolean(newPaymentMethod)) {
      return true
    }
    return false
  }

  const isAddPaymentMethodButtonDisabled = () => {
    return !(
      billingFormAddress.isAddressValid &&
      (cardFormDetails.isCardDetailsValidated ||
        purchaseOrderFormDetails.isPurchaseOrderFormValidated)
    )
  }

  const cancelAddingNewPaymentMethod = () => {
    setIsAddingNewPayment(false)
    setNewPaymentMethod('')
    setBillingFormAddress(initialBillingAddressData)
    setCardFormDetails(initialCardFormData)
  }

  const handleCardFormValidDetails = (isValid: boolean) => {
    setCardFormDetails({ ...cardFormDetails, isCardDetailsValidated: isValid })
  }

  const handlePurchaseOrderFormValidDetails = (isValid: boolean) => {
    setPurchaseOrderFormDetails({
      ...purchaseOrderFormDetails,
      isPurchaseOrderFormValidated: isValid,
    })
  }

  const handleBillingFormValidDetails = (isValid: boolean) => {
    setBillingFormAddress({ ...billingFormAddress, isAddressValid: isValid })
  }

  const handleAddPaymentMethod = () => {
    setBillingFormAddress(initialBillingAddressData)
    setIsAddingNewPayment(true)
  }

  // Sets validateForm to true to get the card and billing details
  const handleSaveNewPaymentMethod = async () => {
    setValidateForm(true)
  }

  const saveCardDataToOrder = async () => {
    let paymentAction: PaymentActionInput = {}

    const selectedPaymentMethod = savedPaymentBillingDetails.find(
      (each) => each?.cardInfo?.id === selectedPaymentBillingRadio
    )

    if (newPaymentMethod === PaymentType.CREDITCARD) {
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

      paymentAction = buildCardPaymentActionForCheckoutParams(
        CurrencyCode.US,
        checkout,
        cardDetails,
        tokenizedData,
        selectedPaymentMethod?.billingAddressInfo?.contact as CrContact,
        isSameAsShipping
      )

      const paymentsWithNewStatus = orderGetters.getSelectedPaymentMethods(
        checkout,
        PaymentType.CREDITCARD
      )

      if (
        paymentsWithNewStatus?.billingInfo?.card?.paymentServiceCardId ===
        selectedPaymentBillingRadio
      ) {
        setStepStatusComplete()
        setStepNext()
        return
      }

      if (paymentsWithNewStatus) {
        const card = paymentsWithNewStatus?.billingInfo?.card
        cardDetails.cardType = card?.paymentOrCardType as string
        cardDetails.expireMonth = card?.expireMonth as number
        cardDetails.expireYear = card?.expireYear as number
        cardDetails.paymentType = paymentsWithNewStatus?.paymentType as string

        let paymentActionToBeVoided = buildCardPaymentActionForCheckoutParams(
          CurrencyCode.US,
          checkout,
          cardDetails,
          tokenizedData,
          paymentsWithNewStatus?.billingInfo?.billingContact as CrContact,
          isSameAsShipping
        )

        paymentActionToBeVoided = { ...paymentActionToBeVoided, actionName: 'VoidPayment' }
        await onVoidPayment(
          checkout?.id as string,
          paymentsWithNewStatus?.id as string,
          paymentActionToBeVoided
        )
      }

      if (checkout?.id) {
        paymentAction = { ...paymentAction, actionName: '' }
        await onAddPayment(checkout.id, paymentAction)
        setStepStatusComplete()
        setStepNext()
      }
    }
  }

  const savePurchaseOrderDataToOrder = async () => {
    let paymentAction: PaymentActionInput = {}
    let purchaseOrderData: any = {}
    const isSameAsShipping = addressGetters.getIsBillingShippingAddressSame(
      savedPaymentBillingDetailsForPurchaseOrder?.[0]?.billingAddressInfo
    )
    purchaseOrderData = savedPaymentBillingDetailsForPurchaseOrder?.[0]?.purchaseOrder || {}
    paymentAction = buildPurchaseOrderPaymentActionForCheckoutParams(
      CurrencyCode.US,
      checkout,
      purchaseOrderData,
      savedPaymentBillingDetailsForPurchaseOrder?.[0]?.billingAddressInfo?.contact as CrContact,
      isSameAsShipping
    )
    const paymentsPurchaseOrderWithNewStatus = orderGetters.getSelectedPaymentMethods(
      checkout,
      PaymentType.PURCHASEORDER
    )

    if (paymentsPurchaseOrderWithNewStatus) {
      const purchaseOrderDataWithNewStatus = {
        poNumber:
          paymentsPurchaseOrderWithNewStatus?.billingInfo?.purchaseOrder?.purchaseOrderNumber,
        purchaseOrderPaymentTerms:
          paymentsPurchaseOrderWithNewStatus?.billingInfo?.purchaseOrder?.paymentTerm?.code,
        paymentType: paymentsPurchaseOrderWithNewStatus?.paymentType,
      }

      let paymentActionToBeVoided = buildPurchaseOrderPaymentActionForCheckoutParams(
        CurrencyCode.US,
        checkout,
        purchaseOrderDataWithNewStatus,
        paymentsPurchaseOrderWithNewStatus?.billingInfo?.billingContact as CrContact,
        isSameAsShipping
      )

      paymentActionToBeVoided = { ...paymentActionToBeVoided, actionName: 'VoidPayment' }
      await onVoidPayment(
        checkout?.id as string,
        paymentsPurchaseOrderWithNewStatus?.id as string,
        paymentActionToBeVoided
      )
    }
    if (checkout?.id) {
      paymentAction = { ...paymentAction, actionName: '' }
      await onAddPayment(checkout.id, paymentAction)
      setStepStatusComplete()
      setStepNext()
    }
  }

  const handleTokenization = async (card: CardForm) => {
    const { publicRuntimeConfig } = getConfig()
    const pciHost = publicRuntimeConfig?.pciHost
    const apiHost = publicRuntimeConfig?.apiHost as string
    const tokenizedCardResponse: TokenizedCard = await tokenizeCreditCardPayment(
      card,
      pciHost,
      apiHost
    )

    if (!tokenizedCardResponse) return

    setIsAddingNewPayment(false)

    setSavedPaymentBillingDetails([
      ...savedPaymentBillingDetails,
      {
        cardInfo: {
          id: tokenizedCardResponse.id,
          cardNumberPart: tokenizedCardResponse.numberPart,
          paymentType: newPaymentMethod,
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

    setSelectedPaymentBillingRadio(tokenizedCardResponse.id as string)
    setValidateForm(false)
    setIsCVVAddedForNewPayment(true)
  }

  const handlePurchaseOrderValidation = async (purchaseOrderFormData: any) => {
    setIsAddingNewPayment(false)
    setSavedPaymentBillingDetailsForPurchaseOrder([
      ...savedPaymentBillingDetailsForPurchaseOrder,
      {
        purchaseOrder: {
          poNumber: purchaseOrderFormData?.poNumber,
          purchaseOrderPaymentTerms:
            purchaseOrderPaymentTerms?.length <= 1
              ? purchaseOrderPaymentTerms?.[0]
              : purchaseOrderFormData?.paymentTerms,
          paymentType: PaymentType.PURCHASEORDER,
        },
        billingAddressInfo: {
          ...billingFormAddress,
          isSameBillingShippingAddress: billingFormAddress.isSameBillingShippingAddress,
        },
      },
    ])
    setValidateForm(false)
  }

  const handleInitialCardDetailsLoad = () => {
    setStepStatusIncomplete()

    // get card and billing address formatted data from server
    const accountPaymentDetails =
      userGetters.getSavedCardsAndBillingDetails(
        customerCardsCollection,
        customerContactsCollection
      ) || []

    // get previously saved checkout payments
    const checkoutPaymentWithNewStatus = orderGetters.getSelectedPaymentMethods(
      checkout,
      PaymentType.CREDITCARD
    )

    // if checkoutPayment details are not present in accountPaymentDetails, push it and set it as selected radio
    if (checkoutPaymentWithNewStatus) {
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

      setSelectedPaymentBillingRadio(cardDetails?.paymentServiceCardId as string)
    }

    // find default payment details from server data
    const defaultCard = userGetters.getDefaultPaymentBillingMethod(accountPaymentDetails)

    // if defaultCard is available, set as selected radio
    cardGetters.getCardId(defaultCard?.cardInfo) &&
      selectedPaymentBillingRadio === '' &&
      setSelectedPaymentBillingRadio(defaultCard.cardInfo?.id as string)

    if (accountPaymentDetails?.length) {
      setSavedPaymentBillingDetails(accountPaymentDetails)
      setNewPaymentMethod(PaymentType.CREDITCARD)
    }
  }

  const handleInitialPurchaseOrderDetailsLoad = () => {
    setStepStatusIncomplete()

    // get previously saved checkout payments
    const checkoutPaymentWithNewStatus = orderGetters.getSelectedPaymentMethods(
      checkout,
      PaymentType.PURCHASEORDER
    )

    if (checkoutPaymentWithNewStatus) {
      const billingAddress = checkoutPaymentWithNewStatus?.billingInfo?.billingContact
      const purchaseOrderDetails: any = {
        purchaseOrder: {
          poNumber: checkoutPaymentWithNewStatus?.billingInfo?.purchaseOrder?.purchaseOrderNumber,
          purchaseOrderPaymentTerms:
            checkoutPaymentWithNewStatus?.billingInfo?.purchaseOrder?.paymentTerm?.code,
          paymentType: checkoutPaymentWithNewStatus?.paymentType,
        },
        billingAddressInfo: {
          contact: {
            ...billingAddress,
          },
        },
      }
      setSavedPaymentBillingDetailsForPurchaseOrder([purchaseOrderDetails])
      setNewPaymentMethod(PaymentType.PURCHASEORDER)
    }
  }

  const handleValidateBillingAddress = async (address: CuAddress) => {
    try {
      await validateCustomerAddress.mutateAsync({
        addressValidationRequestInput: {
          address,
        },
      })
      newPaymentMethod === PaymentType.CREDITCARD && handleTokenization({ ...cardFormDetails })
      newPaymentMethod === PaymentType.PURCHASEORDER &&
        handlePurchaseOrderValidation({ ...purchaseOrderFormDetails })
    } catch (error) {
      setValidateForm(false)
      console.error(error)
    }
  }

  // handle initial load of cards and contacts
  useEffect(() => {
    // handle saved payment methods in account
    if ((isCustomerCardsSuccess && isCustomerContactsSuccess) || !isAuthenticated) {
      handleInitialCardDetailsLoad()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustomerCardsSuccess, isCustomerContactsSuccess, checkout])

  useEffect(() => {
    if (isCustomerPurchaseOrderAccount) handleInitialPurchaseOrderDetailsLoad()
  }, [isCustomerPurchaseOrderAccount, checkout])

  // when payment card and billing address info is available, handleTokenization
  useEffect(() => {
    if (
      isAddingNewPayment &&
      validateForm &&
      cardFormDetails.cardNumber &&
      billingFormAddress.contact.firstName
    ) {
      handleValidateBillingAddress({ ...billingFormAddress.contact.address })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAddingNewPayment,
    validateForm,
    cardFormDetails.cardNumber,
    billingFormAddress.contact.firstName,
  ])
  // when purchase order and billing address info is available, handleTokenization
  useEffect(() => {
    if (
      isAddingNewPayment &&
      validateForm &&
      purchaseOrderFormDetails.poNumber &&
      billingFormAddress.contact.firstName
    ) {
      handleValidateBillingAddress({ ...billingFormAddress.contact.address })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAddingNewPayment,
    validateForm,
    purchaseOrderFormDetails.poNumber,
    billingFormAddress.contact.firstName,
  ])
  // handling review order button status (enabled/disabled)
  useEffect(() => {
    if (selectedPaymentBillingRadio) {
      isAddingNewPayment || !cvv ? setStepStatusIncomplete() : setStepStatusValid()
    } else {
      setStepStatusIncomplete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPaymentBillingRadio, isAddingNewPayment])

  useEffect(() => {
    isAddingNewPayment || savedPaymentBillingDetailsForPurchaseOrder.length === 0
      ? setStepStatusIncomplete()
      : setStepStatusValid()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddingNewPayment, savedPaymentBillingDetailsForPurchaseOrder.length])

  useEffect(() => {
    if (stepStatus === STEP_STATUS.SUBMIT) {
      reCaptchaKey
        ? submitFormWithRecaptcha()
        : newPaymentMethod === PaymentType.CREDITCARD
        ? saveCardDataToOrder()
        : newPaymentMethod === PaymentType.PURCHASEORDER
        ? savePurchaseOrderDataToOrder()
        : null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepStatus])

  useEffect(() => {
    isValid ? setStepStatusValid() : setStepStatusIncomplete()
  }, [isValid])

  return (
    <Stack data-testid="checkout-payment">
      <Typography variant="h2" sx={{ paddingBottom: '1.625rem' }}>
        {t('payment-method')}
      </Typography>

      {shouldShowPreviouslySavedPayments() && (
        <>
          <Stack gap={2} width="100%" data-testid="saved-payment-methods">
            {savedPaymentBillingDetails?.length ? (
              <>
                <KiboRadio
                  radioOptions={savedPaymentBillingDetails?.map((card) => {
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
                            cardNumberPart={cardGetters.getCardNumberPart(card?.cardInfo)}
                            expireMonth={cardGetters.getExpireMonth(card?.cardInfo)}
                            expireYear={cardGetters.getExpireYear(card?.cardInfo)}
                            cardType={cardGetters.getCardType(card?.cardInfo).toUpperCase()}
                            address1={addressGetters.getAddress1(address)}
                            address2={addressGetters.getAddress2(address)}
                            cityOrTown={addressGetters.getCityOrTown(address)}
                            postalOrZipCode={addressGetters.getPostalOrZipCode(address)}
                            stateOrProvince={addressGetters.getStateOrProvince(address)}
                          />
                          {selectedPaymentBillingRadio === card?.cardInfo?.id &&
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
                                          helperText={errors?.cvv?.message as unknown as string}
                                          icon={
                                            <Box pr={1} pt={0.5} sx={{ cursor: 'pointer' }}>
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
                  selected={selectedPaymentBillingRadio}
                  align="flex-start"
                  onChange={handleRadioSavedCardSelection}
                />
              </>
            ) : (
              <Typography variant="h4">{t('no-previously-saved-payment-methods')}</Typography>
            )}

            {/* <Button
              variant="contained"
              color="inherit"
              sx={{ width: { xs: '100%', sm: '50%' } }}
              onClick={handleAddPaymentMethod}
            >
              {t('add-payment-method')}
            </Button> */}
          </Stack>
        </>
      )}
      {shouldShowPreviouslySavedPaymentsForPurchaseOrder() && (
        <>
          <Stack gap={2} width="100%" data-testid="saved-payment-methods">
            {savedPaymentBillingDetailsForPurchaseOrder?.length ? (
              <>
                <KeyValueDisplay
                  option={{
                    name: t('po-number'),
                    value: savedPaymentBillingDetailsForPurchaseOrder?.[0]?.purchaseOrder?.poNumber,
                  }}
                  variant="body1"
                />
                <KeyValueDisplay
                  option={{
                    name: t('payment-terms'),
                    value:
                      savedPaymentBillingDetailsForPurchaseOrder?.[0]?.purchaseOrder
                        ?.purchaseOrderPaymentTerms,
                  }}
                  variant="body1"
                />
                <AddressCard
                  address1={addressGetters.getAddress1(
                    addressGetters.getAddress(
                      savedPaymentBillingDetailsForPurchaseOrder?.[0]?.billingAddressInfo?.contact
                        .address as CrAddress
                    )
                  )}
                  address2={addressGetters.getAddress2(
                    addressGetters.getAddress(
                      savedPaymentBillingDetailsForPurchaseOrder?.[0]?.billingAddressInfo?.contact
                        .address as CrAddress
                    )
                  )}
                  cityOrTown={addressGetters.getCityOrTown(
                    addressGetters.getAddress(
                      savedPaymentBillingDetailsForPurchaseOrder?.[0]?.billingAddressInfo?.contact
                        .address as CrAddress
                    )
                  )}
                  postalOrZipCode={addressGetters.getPostalOrZipCode(
                    addressGetters.getAddress(
                      savedPaymentBillingDetailsForPurchaseOrder?.[0]?.billingAddressInfo?.contact
                        .address as CrAddress
                    )
                  )}
                  stateOrProvince={addressGetters.getStateOrProvince(
                    addressGetters.getAddress(
                      savedPaymentBillingDetailsForPurchaseOrder?.[0]?.billingAddressInfo?.contact
                        .address as CrAddress
                    )
                  )}
                />
              </>
            ) : (
              <Typography variant="h4">{t('no-previously-saved-payment-methods')}</Typography>
            )}

            {/* <Button
              variant="contained"
              color="inherit"
              sx={{ width: { xs: '100%', sm: '50%' } }}
              onClick={handleAddPaymentMethod}
            >
              {t('add-payment-method')}
            </Button> */}
          </Stack>
        </>
      )}

      {/* Payment Method Options Radio List */}
      {shouldShowPaymentMethodOptions() && (
        <FormControl>
          <RadioGroup
            aria-labelledby="payment-types-radio"
            name="radio-buttons-group"
            value={newPaymentMethod}
            onChange={handlePaymentMethodSelection}
            data-testid="payment-types"
          >
            {paymentMethods.map((paymentMethod: PaymentMethod) => {
              return (
                <Box key={paymentMethod.id}>
                  <FormControlLabel
                    sx={{ ...formControlLabelStyle }}
                    value={paymentMethod.id}
                    control={<Radio sx={{ ...radioStyle }} />}
                    label={paymentMethod.name}
                  />
                  {paymentMethod.id === newPaymentMethod ? (
                    <Box sx={{ maxWidth: '100%', marginBottom: '1.75rem' }}>
                      {/* Purchase order form */}
                      {showPurchaseOrderForm() && (
                        <PurchaseOrderForm
                          creditLimit={creditLimit}
                          availableBalance={availableBalance}
                          validateForm={validateForm}
                          onSavePurchaseData={handlePurchaseOrderFormData}
                          purchaseOrderPaymentTerms={purchaseOrderPaymentTerms}
                          onFormStatusChange={handlePurchaseOrderFormValidDetails}
                        />
                      )}
                      {/* Card Details Form */}
                      {shouldShowCardForm() && (
                        <CardDetailsForm
                          validateForm={validateForm}
                          onSaveCardData={handleCardFormData}
                          onFormStatusChange={handleCardFormValidDetails}
                        />
                      )}

                      {/* Save Payment Method for later checkbox */}
                      {shouldShowCardForm() && isAuthenticated && (
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
                      )}

                      {/* Billing Address Form */}
                      {shouldShowBillingAddressForm() && (
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
                              control={
                                <Checkbox name={`${t('billing-address-same-as-shipping')}`} />
                              }
                              label={`${t('billing-address-same-as-shipping')}`}
                              onChange={(_, value) => handleSameAsShippingAddressCheckbox(value)}
                            />
                          )}
                          <AddressForm
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
                      )}
                    </Box>
                  ) : null}
                </Box>
              )
            })}
          </RadioGroup>
        </FormControl>
      )}

      {(shouldShowPreviouslySavedPaymentsForPurchaseOrder() ||
        shouldShowPreviouslySavedPayments()) && (
        <Button
          variant="contained"
          color="inherit"
          sx={{ width: { xs: '100%', sm: '50%' } }}
          onClick={handleAddPaymentMethod}
        >
          {t('add-payment-method')}
        </Button>
      )}
    </Stack>
  )
}

export default PaymentStep
