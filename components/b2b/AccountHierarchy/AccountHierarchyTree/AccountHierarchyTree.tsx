import * as React from 'react'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DragIndicator from '@mui/icons-material/DragIndicator'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import Nestable from 'react-nestable'

import { AccountHierarchyStyles } from './AccountHierarchyTree.styles'
import { AccountHierarchyTreeLabel } from '@/components/b2b'
import { AddChildAccountProps, EditChildAccountProps, HierarchyNode } from '@/lib/types'

import { B2BAccount } from '@/lib/gql/types'

interface TreeItemListProps {
  accounts: any[]
  hierarchy: HierarchyNode[] | undefined
}

interface AccountHierarchyTreeProps extends TreeItemListProps {
  handleViewAccount: (item: B2BAccount) => void
  handleAddAccount: ({ isAddingAccountToChild, accounts }: AddChildAccountProps) => void
  handleEditAccount: ({ accounts }: EditChildAccountProps) => void
  handleSwapAccount: (b2BAccount: B2BAccount) => void
  handleDeleteAccount: (b2BAccount: B2BAccount) => void
  role: string
}

const CollapseStateIndicator = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {isCollapsed ? <ChevronRightIcon /> : <ExpandMoreIcon />}
    </Box>
  )
}

export default function AccountHierarchyTree(props: AccountHierarchyTreeProps) {
  const {
    accounts,
    hierarchy,
    role,
    handleViewAccount,
    handleAddAccount,
    handleEditAccount,
    handleDeleteAccount,
    handleSwapAccount,
  } = props

  const theme = useTheme()
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'))
  const RoleContext = React.createContext(role)

  const { t } = useTranslation('common')

  const renderItem = (props: any) => {
    const { item, collapseIcon, handler } = props

    const currentAccount = accounts?.find((account: any) => account.id === item.id)

    const onViewAccountClick = () => {
      handleViewAccount(currentAccount)
    }

    const onAddAccountClick = () =>
      handleAddAccount({
        isAddingAccountToChild: true,
        accounts: [currentAccount],
      })

    const onEditAccountClick = () =>
      handleEditAccount({
        accounts,
        accountToEdit: currentAccount,
      })

    const onDeleteAccountClick = () => handleDeleteAccount(currentAccount)

    const onAccountSwap = () => handleSwapAccount(currentAccount)

    return (
      <AccountHierarchyTreeLabel
        role={role}
        mdScreen={mdScreen}
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
        items={hierarchy as HierarchyNode[]}
        renderItem={renderItem}
        renderCollapseIcon={({ isCollapsed }) => (
          <CollapseStateIndicator isCollapsed={isCollapsed} />
        )}
        onChange={() => handleSwapAccount(accounts[0])}
        handler={
          <Box display="flex" justifyContent="center" alignItems="center">
            <DragIndicator />
          </Box>
        }
      />
    </RoleContext.Provider>
  )
}
