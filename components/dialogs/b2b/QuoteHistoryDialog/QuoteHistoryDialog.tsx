import React from 'react'

import { useTranslation } from 'next-i18next'

import { quoteMock } from '@/__mocks__/stories/quoteMock'
import { QuoteHistory } from '@/components/b2b'
import { KiboDialog } from '@/components/common'

interface QuoteHistoryDialogProps {
  closeModal: () => void
}

const QuoteHistoryDialog = (props: QuoteHistoryDialogProps) => {
  const { closeModal } = props
  const { t } = useTranslation('common')

  const DialogArgs = {
    Title: t('quote-history'),
    Content: <QuoteHistory auditHistory={quoteMock.auditHistory} />,
    showContentTopDivider: true,
    showContentBottomDivider: false,
    isDialogCentered: true,
    customMaxWidth: '35rem',
    onClose: () => closeModal(),
  }

  return <KiboDialog {...DialogArgs} />
}
export default QuoteHistoryDialog
