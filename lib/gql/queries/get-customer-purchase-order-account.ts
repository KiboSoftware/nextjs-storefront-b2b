const getCustomerPurchaseOrderQuery = /* GraphQL */ `
  query customerPurchaseOrderAccount($accountId: Int!) {
    customerPurchaseOrderAccount(accountId: $accountId) {
      creditLimit
      availableBalance
      totalAvailableBalance
      overdraftAllowance
      overdraftAllowanceType
      customerPurchaseOrderPaymentTerms {
        code
        siteId
        description
      }
    }
  }
`
export default getCustomerPurchaseOrderQuery
