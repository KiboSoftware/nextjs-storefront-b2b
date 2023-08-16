import React from 'react'

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'

import { AccountHierarchyActions } from '@/components/b2b'
import { B2BRoles } from '@/lib/constants'

interface AccountHierarchyTreeLabelProps {
  label: string
  icons?: any
  role: string
  mdScreen?: boolean
  onViewAccountClick: () => void
  onAddAccountClick: () => void
  onEditAccountClick: () => void
  onDeleteAccountClick: () => void
  onAccountSwap: () => void
}

const AccountHierarchyTreeLabel = (props: AccountHierarchyTreeLabelProps) => {
  const {
    label,
    icons,
    role,
    mdScreen,
    onViewAccountClick,
    onAddAccountClick,
    onEditAccountClick,
    onDeleteAccountClick,
  } = props

  return (
    <List dense={true}>
      <ListItem
        data-testid="tree-label"
        // onClick={() => onViewAccountClick()}
        secondaryAction={
          role !== B2BRoles.NON_PURCHASER ? (
            <AccountHierarchyActions
              role={role}
              mdScreen={mdScreen}
              onBuyersClick={() => null}
              onQuotesClick={() => null}
              onAdd={() => onAddAccountClick()}
              onView={() => onViewAccountClick()}
              onEdit={() => onEditAccountClick()}
              onDelete={() => onDeleteAccountClick()}
            />
          ) : null
        }
      >
        {icons ? <ListItemIcon>{icons}</ListItemIcon> : null}
        <ListItemText primary={label} />
      </ListItem>
    </List>
  )
}

export default AccountHierarchyTreeLabel
