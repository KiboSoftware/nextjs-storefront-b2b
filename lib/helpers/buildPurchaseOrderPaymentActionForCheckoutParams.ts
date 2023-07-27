import { orderGetters } from '@/lib/getters'

import type {
  Checkout,
  CrBillingInfo,
  CrContact,
  CrOrder,
  PaymentActionInput,
  CrPurchaseOrderPaymentInput,
} from '@/lib/gql/types'

export const buildPurchaseOrderPaymentActionForCheckoutParams = (
  currencyCode: string,
  checkout: CrOrder | Checkout,
  purchaseOrderData: any,
  billingAddress: CrContact,
  isBillingAddressAsShipping: boolean
): PaymentActionInput => {
  const billingInfo: CrBillingInfo = {
    billingContact: { ...billingAddress, email: billingAddress?.email || checkout?.email },
    purchaseOrder: {
      purchaseOrderNumber: purchaseOrderData?.poNumber,
      paymentTerm: {
        code: purchaseOrderData?.purchaseOrderPaymentTerms,
        description: purchaseOrderData?.purchaseOrderPaymentTerms,
      },
      customFields: [],
    },
  }

  return {
    currencyCode,
    amount: orderGetters.getTotal(checkout),
    newBillingInfo: {
      ...billingInfo,
      paymentType: purchaseOrderData.paymentType,
      isSameBillingShippingAddress: isBillingAddressAsShipping,
    },
  }
}
