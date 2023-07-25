import { format } from 'date-fns'

import { DateFormat } from '../constants'
import { Quote, QuoteCollection } from '../gql/types'

const getQuotes = (collection: QuoteCollection) => collection.items as Quote[]

const getNumber = (quote: Quote) => quote.number as number

const getName = (quote: Quote) => quote.name as string

const getExpirationDate = (quote: Quote) =>
  quote.expirationDate ? format(new Date(quote.expirationDate), DateFormat.DATE_FORMAT) : ''

const getCreatedDate = (quote: Quote) =>
  quote.auditInfo?.createDate
    ? format(new Date(quote.auditInfo?.createDate), DateFormat.DATE_FORMAT)
    : ''

const getTotal = (quote: Quote) => quote.total as number

const getStatus = (quote: Quote) => quote.status as string

const getQuoteDetails = (quote: Quote) => {
  return {
    number: getNumber(quote),
    name: getName(quote),
    expirationDate: getExpirationDate(quote),
    createdDate: getCreatedDate(quote),
    total: getTotal(quote),
    status: getStatus(quote),
  }
}

export const quoteGetters = {
  getQuotes,
  getNumber,
  getName,
  getCreatedDate,
  getExpirationDate,
  getTotal,
  getStatus,
  getQuoteDetails,
}
