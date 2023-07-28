import * as React from 'react'

import AddCircle from '@mui/icons-material/AddCircle'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Delete from '@mui/icons-material/Delete'
import DragIndicator from '@mui/icons-material/DragIndicator'
import Edit from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import Nestable from 'react-nestable'

import { B2BRoles } from '@/lib/constants'

interface TreeLabelProps {
  label: string
  icons?: any
}

interface AccountActionsProps {
  role?: string
  onBuyersClick: () => void
  onQuotesClick: () => void
  onAdd: () => void
  onEdit: () => void
  onDelete: () => void
}

interface Hierarchy {
  id: string | number
  children: Hierarchy[]
}

interface TreeItemListProps {
  accounts: any[]
  hierarchy: Hierarchy
}

interface AccountHierarchyTreeProps extends TreeItemListProps {
  role: string
}

const RoleContext = React.createContext(B2BRoles.NON_PURCHASER)

const CollapseStateIndicator = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {isCollapsed ? <ChevronRightIcon /> : <ExpandMoreIcon />}
    </Box>
  )
}

const Handler = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <DragIndicator />
    </Box>
  )
}

const AccountActions = (props: AccountActionsProps) => {
  const { onAdd, onEdit, onDelete, onBuyersClick, onQuotesClick } = props
  const role = React.useContext(RoleContext)

  const { t } = useTranslation('common')

  return (
    <Box display={'flex'} gap={2} alignItems={'center'} onClick={(e) => e.stopPropagation()}>
      <Typography variant="caption" onClick={onBuyersClick}>
        {t('buyers')}
      </Typography>
      <Typography variant="caption" onClick={onQuotesClick}>
        {t('quotes')}
      </Typography>
      {role === B2BRoles.ADMIN && (
        <Box display={'flex'} gap={2}>
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            aria-label="item-add"
            name="item-add"
            onClick={onAdd}
          >
            <AddCircle />
          </IconButton>
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            aria-label="item-edit"
            name="item-edit"
            onClick={onEdit}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            aria-label="item-delete"
            name="item-delete"
            onClick={onDelete}
          >
            <Delete />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

const TreeLabel = (props: TreeLabelProps) => {
  const { label, icons } = props

  const role = React.useContext(RoleContext) // need to fetch using useAuthContext

  return (
    <List dense={true}>
      <ListItem
        data-testid="tree-label"
        secondaryAction={
          role !== B2BRoles.NON_PURCHASER ? (
            <AccountActions
              role={role}
              onBuyersClick={() => null}
              onQuotesClick={() => null}
              onAdd={() => null}
              onEdit={() => null}
              onDelete={() => null}
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

export default function AccountHierarchyTree(props: AccountHierarchyTreeProps) {
  const { accounts, hierarchy, role } = props

  const { t } = useTranslation('common')

  const renderItem = (props: any) => {
    const { item, collapseIcon, handler } = props

    const currentAccount = accounts?.find((account: any) => account.id === item.id)

    return (
      <TreeLabel
        label={currentAccount?.companyOrOrganization}
        icons={
          <ListItemIcon sx={{ display: 'flex' }}>
            <IconButton size="small">{handler}</IconButton>
            {collapseIcon ? <IconButton size="small">{collapseIcon}</IconButton> : null}
          </ListItemIcon>
        }
      />
    )
  }

  const handleCollapse = (collapseCase: 'ALL' | 'NONE') => {
    const instance = refNestable.current as any
    instance?.collapse(collapseCase)
  }

  // Use Confirmation Dialog
  const confirmChange = () => null

  const refNestable = React.useRef<Nestable | null>(null)

  return (
    <RoleContext.Provider value={role}>
      <Box display={'flex'} justifyContent={'flex-end'} gap={2}>
        <Button onClick={() => handleCollapse('NONE')}>{t('expand-all')}</Button>
        <Button onClick={() => handleCollapse('ALL')}>{t('collapse-all')}</Button>
      </Box>
      <Nestable
        ref={(el) => (refNestable.current = el)}
        items={[hierarchy]}
        renderItem={renderItem}
        handler={<Handler />}
        renderCollapseIcon={({ isCollapsed }) => (
          <CollapseStateIndicator isCollapsed={isCollapsed} />
        )}
        onChange={confirmChange}
        //onChange={(items) => console.log(items)}
      />
    </RoleContext.Provider>
  )
}
