import React from 'react'

import {
  AddCircle as AddCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilitiyIcon,
} from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { CartItemActionsMobile } from '@/components/cart'
import { AccountActions, AllAccountActions, B2BRoles } from '@/lib/constants'

interface AccountHierarchyActionsProps {
  role?: string
  mdScreen?: boolean
  onBuyersClick: () => void
  onQuotesClick: () => void
  onAdd: () => void
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

const AccountHierarchyActions = (props: AccountHierarchyActionsProps) => {
  const { role, mdScreen, onAdd, onView, onEdit, onDelete, onBuyersClick, onQuotesClick } = props
  const { t } = useTranslation('common')

  const onMenuItemSelection = (option: string) => {
    switch (option) {
      case AllAccountActions.ADD_ACCOUNT: {
        onAdd()
        break
      }
      case AllAccountActions.VIEW_ACCOUNT: {
        onView()
        break
      }
      case AllAccountActions.EDIT_ACCOUNT: {
        onEdit()
        break
      }
      case AllAccountActions.DELETE_ACCOUNT: {
        onDelete()
        break
      }
      case AllAccountActions.VIEW_BUYER_ACCOUNT: {
        onBuyersClick()
      }
    }
  }

  return mdScreen ? (
    <Box
      data-testid="account-actions"
      display={'flex'}
      gap={2}
      alignItems={'center'}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography variant="caption" sx={{ textDecoration: 'underline' }} onClick={onBuyersClick}>
        {t('buyers')}
      </Typography>
      <Typography variant="caption" sx={{ textDecoration: 'underline' }} onClick={onQuotesClick}>
        {t('quotes')}
      </Typography>
      {role === B2BRoles.ADMIN && (
        <Box display={'flex'} gap={2}>
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            aria-label="item-view"
            name="item-view"
            onClick={onView}
          >
            <VisibilitiyIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            aria-label="item-add"
            name="item-add"
            onClick={onAdd}
          >
            <AddCircleIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            aria-label="item-edit"
            name="item-edit"
            onClick={onEdit}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            aria-label="item-delete"
            name="item-delete"
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  ) : (
    <CartItemActionsMobile
      data-testid="mobile-account-actions"
      actions={AccountActions[role as string]}
      width="15.5rem"
      onMenuItemSelection={onMenuItemSelection}
    />
  )
}

export default AccountHierarchyActions
