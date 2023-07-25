import React, { useState } from 'react'

import { Box, Button, Chip, Stack, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { KiboDialog, KiboTextBox } from '@/components/common'

import type { CrCartItem as CartItemType } from '@/lib/gql/types'

interface CartDetailsProps {
  cartItem: CartItemType
  isDialogCentered: boolean
  closeModal: () => void
}

interface QuotesFilterActionsProps {
  onSend: () => void
  onCancel: () => void
}

const EmailQuoteContent = () => {
  const { t } = useTranslation('common')
  const [emails, setEmails] = useState<string[]>([])
  const [errorText, setErrorText] = useState<string>('')
  const [value, setValue] = useState<string>('')

  const handleDelete = (value: string) => {
    setEmails(emails.filter((email) => email !== value))
  }

  const handleEnterPress = (event: any) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      const { value } = event.target
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(value)) {
        setEmails([...emails, value])
        setErrorText('')
        setValue('')
      } else {
        setErrorText(t('invalid-email-error'))
      }
    }
  }

  const handleChange = (name: string, value: string) => {
    setValue(value)
  }

  return (
    <Stack>
      <KiboTextBox
        label="Email Address"
        placeholder="Press Enter after each email address"
        onKeyDown={handleEnterPress}
        onChange={handleChange}
        value={value}
        error={!!errorText}
        helperText={errorText}
      />
      <Box display={'flex'} flexWrap={'wrap'} gap={1.5}>
        {emails.map((email) => (
          <Chip key={email} label={email} variant="outlined" onDelete={() => handleDelete(email)} />
        ))}
      </Box>
    </Stack>
  )
}

const EmailQuoteActions = (props: QuotesFilterActionsProps) => {
  const { onSend, onCancel } = props
  const { t } = useTranslation('common')
  const theme = useTheme()
  const tabAndDesktop = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Stack gap={2} width="100%" direction={tabAndDesktop ? 'row' : 'column'}>
      <Button
        name="cancel"
        sx={{ width: '100%' }}
        variant="contained"
        color="secondary"
        onClick={onCancel}
      >
        {t('cancel')}
      </Button>
      <Button name="confirm" sx={{ width: '100%' }} variant="contained" onClick={onSend}>
        {t('send')}
      </Button>
    </Stack>
  )
}

// Component
const QuotesFilterDialog = (props: CartDetailsProps) => {
  const { closeModal } = props
  const { t } = useTranslation('common')

  const handleEmailSend = () => {
    closeModal()
  }
  const handleCancel = () => {
    closeModal()
  }

  const DialogArgs = {
    Title: t('email-quote'),
    Content: <EmailQuoteContent />,
    showContentTopDivider: true,
    showContentBottomDivider: false,
    Actions: <EmailQuoteActions onSend={handleEmailSend} onCancel={handleCancel} />,
    isDialogCentered: true,
    customMaxWidth: '32.375rem',
    onClose: () => closeModal(),
  }

  return <KiboDialog {...DialogArgs} />
}
export default QuotesFilterDialog
