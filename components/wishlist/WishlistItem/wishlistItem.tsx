import React, { useState } from 'react'

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded'
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Image from 'next/image'

import Accordion from '@/components/common/Accordion/Accordion'
import style from '@/components/wishlist/WishlistItem/WishlistItemStyle'
import labels from '@/public/locales/en/common.json'

const ProductView = (props: any) => {
  return (
    <>
      <div className="modal-head" style={style.modal.header}>
        <Typography variant="h3" style={{ fontWeight: 'bold' }}>
          Product Configuration Options
        </Typography>
        <IconButton onClick={() => props.closeModal()}>
          <CloseIcon color="secondary" />
        </IconButton>
      </div>
      <Container style={{ padding: '70px' }}>
        <Grid container>
          <Grid item sm={3}>
            {props.item?.product?.imageUrl ? (
              <Image
                src={`https:${props.item?.product?.imageUrl}`}
                alt={props.item?.product?.name}
                width={70}
                height={70}
              />
            ) : null}
          </Grid>
          <Grid item sm={9}>
            <Typography variant="h3" style={{ fontWeight: 'bold' }}>
              {props?.item?.product?.name}
            </Typography>
            <div>
              <p>Product Code: {props?.item?.product?.productCode}</p>
              <p>
                <strong>Price: </strong> <br />
                <span style={{ color: '#E42D00' }}>
                  {' '}
                  $ {props.item.subtotal ? props.item.subtotal : props.item.total}{' '}
                </span>
              </p>
              <p style={{ fontStyle: 'italic', fontSize: '13px' }}>
                Line Item -
                {props?.item?.product?.price?.salePrice
                  ? props?.item?.product?.price?.salePrice
                  : props?.item?.product?.price?.price}
              </p>
            </div>
            <div>
              <Accordion
                title="Description"
                disabled={false}
                content={props.item.product.description}
                style={{}}
              />
              <Accordion
                title="Properties"
                disabled={false}
                content={`Development in progress`}
                style={{}}
              />
              <Accordion
                title="Measurements"
                disabled={false}
                content={`Development in progress`}
                style={{}}
              />
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const WishlistItem = (props: any) => {
  const theme = useTheme()
  const mdScreen = useMediaQuery<any>(theme.breakpoints.up('md'))
  // const { addToCart } = useAddToCartMutation();
  const [state, setState] = useState({ quantity: props.item?.quantity })
  const [open, setOpen] = useState(false)
  function changeQuantity(e: any) {
    setState(e.target.value)
    props.changeQuantity(e)
  }

  // async function handleAddToCart(e: any) {
  //     const productCode = props?.item.product.productCode
  //     const cartResponse = await addToCart.mutateAsync({
  //         product: {
  //             productCode,
  //             options: props.item.product.options || []
  //         },
  //         quantity: state.quantity
  //     })
  // }
  async function handleQuantityChange(e: any) {
    switch (e.currentTarget.name) {
      case 'decrement':
        setState({ quantity: --state.quantity })
        break
      case 'increment':
        setState({ quantity: ++state.quantity })
        break
      default:
        console.log('default')
    }
    props.changeQuantity(props.item.id, state.quantity)
  }

  function openEditModal() {
    setOpen(true)
  }

  return (
    <>
      {/* <Grid spacing={2} className={Style.borderBottom}> */}
      <Grid container style={{ borderBottom: '1px solid #CDCDCD', padding: '10px 0' }}>
        <Grid item xs={mdScreen ? 2 : 3}>
          {props.item?.product?.imageUrl ? (
            <Image
              src={`https:${props.item?.product?.imageUrl}`}
              alt={props.item?.product?.name}
              width={70}
              height={70}
            />
          ) : null}
        </Grid>
        <Grid xs={mdScreen ? 8 : 7}>
          <p>
            <strong>{props.item?.product?.name}</strong>
          </p>
          {mdScreen ? (
            <></>
          ) : (
            <>
              <div>
                <strong>{labels.total}: </strong>${props.item?.subtotal}
                <div>
                  <em>
                    {labels['list-item']} - ${props.item?.product?.price?.price}
                  </em>
                </div>
              </div>
            </>
          )}
          <div>
            <strong>Qty: </strong>
            <IconButton
              name="decrement"
              onClick={handleQuantityChange}
              disabled={state.quantity <= 1}
            >
              <RemoveCircleOutlineRoundedIcon />
            </IconButton>
            <input
              type="text"
              value={state.quantity}
              onChange={changeQuantity}
              id={props.item.id}
              style={{ textAlign: 'center', width: '43px', height: '37px', fontSize: '16px' }}
            />
            <IconButton name="increment" onClick={handleQuantityChange}>
              <AddCircleOutlineRoundedIcon />
            </IconButton>
          </div>
          <p>
            <strong>Product Code: </strong>
            {props.item?.product?.productCode}
          </p>
          {mdScreen ? (
            <>
              <div>
                <strong>{labels.total}: </strong>${props.item?.subtotal}
                <span style={{ marginLeft: '10px' }}>
                  <em>
                    {labels['list-item']} - ${props.item?.product?.price?.price}
                  </em>
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid
          xs={2}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: mdScreen ? 'center' : 'flex-start',
          }}
        >
          <div style={{ maxWidth: '100%', display: 'flex', flexDirection: 'row' }}>
            <Button onClick={openEditModal} startIcon={<EditIcon />} sx={style.buttons.tableAction}>
              {mdScreen ? 'Edit Item' : ''}
            </Button>
            <Button
              sx={style.buttons.tableAction}
              aria-label="delete"
              id={props.item.id}
              onClick={props.deleteItem}
              startIcon={<DeleteIcon />}
            >
              {mdScreen ? 'Remove' : ''}
            </Button>
          </div>
          {/* <Button variant='contained' color='primary' onClick={handleAddToCart} id={props.item.id}> Add to cart</Button> */}
        </Grid>
      </Grid>
      {/* </Grid> */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style.modal.box}>
          <ProductView item={props.item} closeModal={() => setOpen(false)} />
        </Box>
      </Modal>
    </>
  )
}
export default WishlistItem
