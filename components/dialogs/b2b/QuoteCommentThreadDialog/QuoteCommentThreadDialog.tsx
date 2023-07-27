import React from 'react'

import { useTranslation } from 'next-i18next'

import { quoteMock } from '@/__mocks__/stories/quoteMock'
import { QuotesCommentThread } from '@/components/b2b'
import { KiboDialog } from '@/components/common'

interface QuoteCommentThreadDialogProps {
  closeModal: () => void
}

const QuoteCommentThreadDialog = (props: QuoteCommentThreadDialogProps) => {
  const { closeModal } = props
  const { t } = useTranslation('common')

  const handleComment = () => {
    closeModal()
  }

  const DialogArgs = {
    Title: t('email-quote'),
    Content: (
      <QuotesCommentThread comments={quoteMock.comments} userId={''} onAddComment={handleComment} />
    ),
    showContentTopDivider: true,
    showContentBottomDivider: false,
    isDialogCentered: true,
    customMaxWidth: '32.375rem',
    onClose: () => closeModal(),
  }

  return <KiboDialog {...DialogArgs} />
}
export default QuoteCommentThreadDialog
