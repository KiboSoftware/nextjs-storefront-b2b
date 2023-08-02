const getCustomerB2BAccountsQuery = /* GraphQL */ `
  query customerAccounts($startIndex: Int, $pageSize: Int, $filter: String, $q: String) {
    customerAccounts(startIndex: $startIndex, pageSize: $pageSize, filter: $filter, q: $q) {
      startIndex
      totalCount
      pageSize
      pageCount
      items {
        id
        emailAddress
        firstName
        lastName
        isActive
        userId
        companyOrOrganization
        taxId
        accountType
      }
    }
  }
`

export default getCustomerB2BAccountsQuery
