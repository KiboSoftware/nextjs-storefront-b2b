import type { CrOrder, CrContact, CrFulfillmentInfoInput, Quote } from '@/lib/gql/types'

export interface QuoteFullmentInfoParams {
  quoteId: string
  updateMode: string
  fulfillmentInfoInput: CrFulfillmentInfoInput
}

export interface UpdateQuoteFulfillmentInfoParams {
  quoteId: string
  quote: Quote
  updateMode: string
  contact?: CrContact
  email?: string
  shippingMethodCode?: string
  shippingMethodName?: string
}

export const buildUpdateQuoteFulfillmentInfoParams = (
  params: UpdateQuoteFulfillmentInfoParams
): QuoteFullmentInfoParams => {
  const { quoteId, updateMode, quote, contact, email, shippingMethodCode, shippingMethodName } =
    params

  return {
    quoteId,
    updateMode,

    fulfillmentInfoInput: {
      fulfillmentContact: {
        ...(contact ? contact : quote.fulfillmentInfo?.fulfillmentContact),
        email: email ? email : quote.email,
      },

      shippingMethodCode: shippingMethodCode ? shippingMethodCode : null,

      shippingMethodName: shippingMethodName ? shippingMethodName : null,
    } as CrFulfillmentInfoInput,
  } as QuoteFullmentInfoParams
}
