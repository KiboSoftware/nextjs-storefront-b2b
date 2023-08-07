const getQuoteByIDQuery = /* GraphQL */ `
  query getQuoteByID($quoteId: String!) {
    quote(quoteId: $quoteId) {
      id
      number
      status
      userId
      auditInfo {
        createBy
        createDate
      }
      expirationDate
    }
  }
`
export default getQuoteByIDQuery
