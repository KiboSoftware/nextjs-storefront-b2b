export const quoteFragment = `
fragment quoteFragment on Quote {
        id
        name
        siteId
        tenantId
        number
        submittedDate
        items {
            product {
                productCode
                name
                description
                imageUrl
                options {
                attributeFQN
                name
                value
                }
                properties {
                attributeFQN
                name
                values {
                    value
                }
                }
                sku
                price {
                price
                salePrice
                }
                categories {
                id
                }
            }
        }
        auditInfo {
            createDate
            createBy
        }
        userId
        accountId
  }
`
