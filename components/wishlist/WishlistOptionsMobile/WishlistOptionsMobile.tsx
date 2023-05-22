import { useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu, MenuItem } from '@mui/material'

const WishlistOptionsMobile = (props: any) => {
  const options = ['Edit', 'Add list items to cart', 'Initiate Quote', 'Duplicate', 'Delete']
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenMenu = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  function handleOptionClick(e: any) {
    console.log('checking', 0 === e.currentTarget.value)
    switch (e.currentTarget.value) {
      case 0:
        props.editWishlist(e)
        handleCloseMenu()
        break
      case 1:
        props.addAllToCart(e)
        handleCloseMenu()
        break
      case 2:
        props.initiateQuote(e)
        handleCloseMenu()
        break
      case 3:
        props.copyWishlist(e)
        handleCloseMenu()
        break
      case 4:
        props.deleteWishlist(e)
        handleCloseMenu()
        break
      default:
        console.log('default')
    }
  }

  return (
    <div style={{ display: 'inline' }}>
      <IconButton onClick={handleOpenMenu} id={props.id}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {options.map((o, i) => (
          <MenuItem
            key={i}
            value={i}
            id={props.id}
            onClick={handleOptionClick}
            style={i !== options.length - 1 ? { borderBottom: '0.5px solid #EAEAEA' } : {}}
          >
            {o}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default WishlistOptionsMobile
