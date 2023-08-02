import * as React from 'react'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DragIndicator from '@mui/icons-material/DragIndicator'
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
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import Nestable from 'react-nestable'

import { AccountHierarchyStyles } from './AccountHierarchyTree.styles'
import { AccountHierarchyActions } from '@/components/b2b'
import { B2BRoles } from '@/lib/constants'
import { AddChildAccountProps } from '@/lib/types/AccountHierarchy'

import { B2BAccount } from '@/lib/gql/types'

interface TreeLabelProps {
  label: string
  icons?: any
  onViewAccountClick: () => void
  onAddAccountClick: () => void
  onEditAccountClick: () => void
  onDeleteAccountClick: () => void
  onAccountSwap: () => void
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
  handleViewAccount: (item: B2BAccount) => void
  handleChildAccountFormSubmit: ({ isAddingAccountToChild, accounts }: AddChildAccountProps) => void
  handleSwapAccount: (b2BAccount: B2BAccount) => void
  handleDeleteAccount: (b2BAccount: B2BAccount) => void
  role: string
}

const RoleContext = React.createContext(B2BRoles.PURCHASER)

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

const TreeLabel = (props: TreeLabelProps) => {
  const {
    label,
    icons,
    onViewAccountClick,
    onAddAccountClick,
    onDeleteAccountClick,
    onEditAccountClick,
  } = props

  const theme = useTheme()
  const role = React.useContext(RoleContext) // need to fetch using useAuthContext
  console.log('role', role)
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <List dense={true}>
      <ListItem
        data-testid="tree-label"
        secondaryAction={
          <AccountHierarchyActions
            role={B2BRoles.ADMIN}
            mdScreen={mdScreen}
            onBuyersClick={() => null}
            onQuotesClick={() => null}
            onAdd={() => onAddAccountClick()}
            onView={() => onViewAccountClick()}
            onEdit={() => onEditAccountClick()}
            onDelete={() => onDeleteAccountClick()}
          />
        }
      >
        {icons ? <ListItemIcon>{icons}</ListItemIcon> : null}
        <ListItemText primary={label} />
      </ListItem>
    </List>
  )
}

export default function AccountHierarchyTree(props: AccountHierarchyTreeProps) {
  const {
    accounts,
    hierarchy,
    role,
    handleViewAccount,
    handleChildAccountFormSubmit,
    handleDeleteAccount,
    handleSwapAccount,
  } = props

  const { t } = useTranslation('common')

  const renderItem = (props: any) => {
    const { item, collapseIcon, handler } = props

    const currentAccount = accounts?.find((account: any) => account.id === item.id)

    const onViewAccountClick = () => {
      handleViewAccount(currentAccount)
    }

    const onAddAccountClick = () =>
      handleChildAccountFormSubmit({
        isAddingAccountToChild: true,
        accounts: [currentAccount],
      })

    const onEditAccountClick = () =>
      handleChildAccountFormSubmit({
        isAddingAccountToChild: false,
        accounts,
        accountToEdit: currentAccount,
      })

    const onDeleteAccountClick = () => handleDeleteAccount(currentAccount)

    const onAccountSwap = () => handleSwapAccount(currentAccount)

    return (
      <TreeLabel
        label={currentAccount?.companyOrOrganization}
        onViewAccountClick={onViewAccountClick}
        onAddAccountClick={onAddAccountClick}
        onEditAccountClick={onEditAccountClick}
        onDeleteAccountClick={onDeleteAccountClick}
        onAccountSwap={onAccountSwap}
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
      <Box sx={{ ...AccountHierarchyStyles.expandCollapseButtonBox }} gap={1}>
        <Button
          sx={{ ...AccountHierarchyStyles.expandCollapseButtonStyle }}
          onClick={() => handleCollapse('NONE')}
        >
          {t('expand-all')}
        </Button>
        <Button
          sx={{ ...AccountHierarchyStyles.expandCollapseButtonStyle }}
          onClick={() => handleCollapse('ALL')}
        >
          {t('collapse-all')}
        </Button>
      </Box>
      <Box sx={{ backgroundColor: '#F7F7F7', padding: '15px' }}>
        <Typography fontWeight="bold">{t('org-name')}</Typography>
      </Box>
      <Nestable
        ref={(el) => (refNestable.current = el)}
        items={[hierarchy]}
        renderItem={renderItem}
        handler={<Handler />}
        renderCollapseIcon={({ isCollapsed }) => (
          <CollapseStateIndicator isCollapsed={isCollapsed} />
        )}
        onChange={() => handleSwapAccount(accounts[0])}
        // onChange={(items) => console.log(items)}
      />
    </RoleContext.Provider>
  )
}
