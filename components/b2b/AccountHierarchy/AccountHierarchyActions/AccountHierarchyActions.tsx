import React from 'react'

import {
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
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
}

const AccountHierarchyActions = (props: AccountHierarchyActionsProps) => {
  const { role, mdScreen, onAdd, onView, onEdit, onBuyersClick, onQuotesClick } = props
  const { t } = useTranslation('common')

  const onMenuItemSelection = (option: string) => {
    const menuItemSelectionMap = {
      [AllAccountActions.ADD_ACCOUNT]: onAdd,
      [AllAccountActions.VIEW_ACCOUNT]: onView,
      [AllAccountActions.EDIT_ACCOUNT]: onEdit,
      [AllAccountActions.VIEW_BUYER_ACCOUNT]: onBuyersClick,
      [AllAccountActions.VIEW_QUOTES]: onQuotesClick,
    }

    const selectedAction = menuItemSelectionMap[option]
    if (selectedAction) {
      selectedAction()
    }
  }

  if (role === B2BRoles.NON_PURCHASER) return null

  return mdScreen ? (
    <Box
      data-testid="account-actions"
      display={'flex'}
      gap={2}
      alignItems={'center'}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography
        variant="caption"
        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
        onClick={onBuyersClick}
      >
        {t('buyers')}
      </Typography>
      <Typography
        variant="caption"
        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
        onClick={onQuotesClick}
      >
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
            <VisibilityIcon />
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
