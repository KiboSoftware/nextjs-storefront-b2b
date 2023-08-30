import React from 'react'

import { useAuthContext } from '@/context'
import { B2BRoles, QuoteStatus } from '@/lib/constants'

const isAdminOrPurchaser = B2BRoles.ADMIN || B2BRoles.PURCHASER

const AccessManager: any = (role: string, quoteStatus?: string, quoteMode?: string) => {
  const { Pending, InReview, ReadyForCheckout, Completed, Expired } = QuoteStatus
  return {
    QuoteAddShippingAddress: role === B2BRoles.ADMIN,
    DeleteQuote: isAdminOrPurchaser,
    EditQuote:
      role === isAdminOrPurchaser && (quoteStatus === Pending || quoteStatus === ReadyForCheckout),
    EmailQuote:
      isAdminOrPurchaser &&
      (quoteStatus === Pending ||
        quoteStatus === InReview ||
        quoteStatus === ReadyForCheckout ||
        quoteStatus === Expired),
  }
}

interface AccessWrapperProps {
  name: string
  quoteStatus?: string
  quoteMode?: string
  children: React.ReactNode
}

// wrap it around any Node that needs to be conditionally rendered based on user role, quote status, or quote mode
const AccessWrapper = (props: AccessWrapperProps) => {
  const { name, quoteStatus, quoteMode } = props
  const { user } = useAuthContext()
  const shouldShow = AccessManager[name](user?.roleName, quoteStatus, quoteMode)

  return shouldShow ? props.children : null
}

export default AccessWrapper
