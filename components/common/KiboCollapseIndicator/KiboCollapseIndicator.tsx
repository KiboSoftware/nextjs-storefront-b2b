import { ChevronRight as ChevronRightIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { Box } from '@mui/material'

const KiboCollapseIndicator = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {isCollapsed ? <ChevronRightIcon /> : <ExpandMoreIcon />}
    </Box>
  )
}

export default KiboCollapseIndicator
