export const buildCreateQuoteItemParams = (
  quoteId: string,
  updateMode: string,
  product: any,
  quantity: number
): any => {
  return {
    quoteId,
    updateMode,
    orderItemInput: {
      product: {
        options: product?.options,
        productCode: product?.productCode || '',
        variationProductCode: product?.variationProductCode || '',
      },
      quantity,
      fulfillmentMethod: product?.fulfillmentMethod,
      fulfillmentLocationCode: product?.purchaseLocationCode,
    },
  }
}
