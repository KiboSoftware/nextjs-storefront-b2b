import { useState } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import { Container, Grid } from '@mui/material'
import Image from 'next/image'

import ProductSearch from '@/components/common/ProductSearch/ProductSearch'
import WishlistItem from '@/components/wishlist/WishlistItem/wishlistItem'
import { useGetSearchedProducts, useWishlist } from '@/hooks'
import { useUpdateWishlistMutation } from '@/hooks/mutations/useWishlistMutations/useUpdateWishlistMutation/useUpdateWishlistMutation'
import Style from '@/styles/global.module.css'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const ProductOption = (props: any) => {
  return (
    <div>
      {' '}
      <p>Options</p>
      <ul className={Style.productOptionUl}>
        {props.data.map((pdata: any) => {
          return (
            <li key={pdata.productCode} className={Style.productOptionLI}>
              <button value={pdata.productCode} onClick={props.onclick}>
                {pdata.options[0].value}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const EditWishlist = (props: any) => {
  const wishlistData = props.data
  const { updateWishlist } = useUpdateWishlistMutation()
  const [state, setState] = useState({
    productCode: '',
    quantity: '1',
    showSuggestions: false,
    name: wishlistData.name,
    openNameForm: false,
  })
  const [open, setOpen] = useState(false)

  function handleChange(e: any) {
    // const id = e.target.id;
    // const value = e.target.value
    // setState(prev=> {
    //     return {...prev, [id]: value}
    // })
    switch (e.target.id) {
      case 'productId':
        setState((prevValue) => {
          return {
            ...prevValue,
            productCode: e.target.value,
            showSuggestions: e.target.value.length > 2,
          }
        })
        // setSearchParams({ search: e.target.value })
        break
      case 'productQty':
        setState((prevValue) => {
          return {
            ...prevValue,
            quantity: e.target.value,
          }
        })
        break
      case 'wishlistName':
        setState((prevValue) => {
          return {
            ...prevValue,
            name: e.target.value,
          }
        })
        break
      default:
        console.log('default')
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    try {
      const items = wishlistData?.items
      const itemPresent =
        items?.findIndex((item: any) => item.product.productCode === state.productCode) !== -1
      // if (itemPresent) {
      //     const itemToBeUpdated = wishlistData?.items?.find((item: any) => item.product.productCode === state.productCode)
      //     itemToBeUpdated.quantity = parseInt(state.quantity);
      // } else {
      //     const newItem = {
      //         quantity: parseInt(state.quantity),
      //         product: {
      //             productCode: state.productCode
      //         }
      //     };
      //     items.push(newItem);
      // }

      wishlistData.name = state.name
      const payload = {
        wishlistId: wishlistData.id,
        wishlistInput: wishlistData,
      }
      const response = await updateWishlist.mutateAsync(payload)
      props.updateWishlistData(response.updateWishlist)
      setState({
        productCode: '',
        quantity: '1',
        showSuggestions: false,
        name: wishlistData.name,
        openNameForm: false,
      })
    } catch (e) {
      console.log(e)
    }
  }
  async function AddToList(e: any) {
    e.preventDefault()
    try {
      const items = wishlistData?.items
      const itemPresent =
        items?.findIndex((item: any) => item.product.productCode === state.productCode) !== -1
      if (itemPresent) {
        const itemToBeUpdated = wishlistData?.items?.find(
          (item: any) => item.product.productCode === state.productCode
        )
        itemToBeUpdated.quantity = parseInt(state.quantity)
      } else {
        const newItem = {
          quantity: parseInt(state.quantity),
          product: {
            productCode: state.productCode,
          },
        }
        items.push(newItem)
      }

      wishlistData.name = state.name
      const payload = {
        wishlistId: wishlistData.id,
        wishlistInput: wishlistData,
      }
      const response = await updateWishlist.mutateAsync(payload)
      props.updateWishlistData(response.updateWishlist)
      setState({
        productCode: '',
        quantity: '1',
        showSuggestions: false,
        name: wishlistData.name,
        openNameForm: false,
      })
      setOpen(false)
    } catch (e) {
      console.log(e)
    }
  }

  async function handleSaveWishlist(e: any) {
    wishlistData.name = state.name
    const payload = {
      wishlistId: wishlistData.id,
      wishlistInput: wishlistData,
    }
    const response = await updateWishlist.mutateAsync(payload)
    props.updateWishlistData(response.updateWishlist)
    props.handleEditWishlist(false)
    props.handleEditForm(false)
    // console.log(state)
  }

  async function deleteItem(e: any) {
    try {
      let items = wishlistData?.items
      items = items.filter((item: any) => item.id !== e.currentTarget.id)
      wishlistData.items = items
      const payload = {
        wishlistId: wishlistData.id,
        wishlistInput: wishlistData,
      }
      const response = await updateWishlist.mutateAsync(payload)
      props.updateWishlistData(response.updateWishlist)
    } catch (e) {
      console.log(e)
    }
  }

  async function changeQuantity(id: string, quantity: number) {
    const items = wishlistData?.items
    const currentItem = items.find((item: any) => item.id === id)
    currentItem.quantity = quantity
  }

  async function handleProductItemClick(e: any) {
    console.log(e.target.id)
    const items = wishlistData.items
    const item = items.find((i: any) => i.product.productCode === e.target.id)
    if (item) {
      console.log('update quantity')
      item.quantity += 1
    } else {
      console.log('add new entry for item')
      items.push({ product: { productCode: e.target.id }, quantity: 1 })
    }
    wishlistData.items = items
    console.log(wishlistData)
    const payload = {
      wishlistId: wishlistData.id,
      wishlistInput: wishlistData,
    }
    const response = await updateWishlist.mutateAsync(payload)
    props.updateWishlistData(response.updateWishlist)
  }
  const handleClose = () => {
    setOpen(false)
    setState({
      productCode: '',
      quantity: '1',
      showSuggestions: false,
      name: wishlistData.name,
      openNameForm: false,
    })
  }

  async function changeProductCode(e: any) {
    setState((prevValue: any) => {
      return {
        ...prevValue,
        productCode: e.target.value,
      }
    })
  }
  console.log(state)
  return (
    <>
      <Box style={{ marginTop: '30px' }}>
        <Grid spacing={2}>
          <Grid
            container
            spacing={0.5}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item xs={9}>
              {state.openNameForm ? (
                <>
                  <form>
                    <input
                      onChange={(e) => setState({ ...state, name: e.target.value })}
                      value={state.name}
                      style={{
                        maxWidth: '495px',
                        height: '36px',
                        fontSize: ' 14px',
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid #cdcdcd',
                        borderRadius: ' 4px',
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => setState({ ...state, openNameForm: false })}
                      style={{ marginLeft: '5px' }}
                    >
                      Save
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Typography variant="h3">
                    {state.name}
                    <IconButton onClick={() => setState({ ...state, openNameForm: true })}>
                      <EditIcon />
                    </IconButton>
                  </Typography>
                </>
              )}
            </Grid>
            <Grid item xs={3} className={Style.addProductButton}>
              <Container style={{ justifyContent: 'end', display: 'flex' }}>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => {
                    props.handleEditWishlist(false)
                    props.handleEditForm(false)
                  }}
                  style={{ marginRight: '10px' }}
                >
                  Cancel
                </Button>
                <Button variant="contained" size="medium" onClick={handleSaveWishlist}>
                  Save & Close
                </Button>
              </Container>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ProductSearch handleProductItemClick={handleProductItemClick} />
            <Grid
              container
              spacing={0.5}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              direction="row"
              justifyContent="flex-start"
              alignItems="top"
            >
              <Grid item xs={4}></Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}></Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div>
              {productData?.map((item: any) => {
                return (
                  <Box sx={style} key={item?.content?.productName}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      <strong>Product Name: </strong>
                      {item?.content?.productName}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      {item?.price?.price ? (
                        <p>
                          <strong>Product price: </strong>${item?.price?.price}
                        </p>
                      ) : (
                        <p>
                          <strong>Product price: </strong>${item?.priceRange?.lower?.price}-$
                          {item?.priceRange?.upper?.price}
                        </p>
                      )}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      <strong>Product code: </strong>
                      {state.productCode}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      <strong>Quantity </strong>
                      <input
                        className={Style.width100}
                        placeholder="Quantity"
                        id="productQty"
                        onChange={handleChange}
                        value={state.quantity}
                      />
                    </Typography>
                    <div>
                      {item?.variations ? (
                        <ProductOption onclick={changeProductCode} data={item?.variations} />
                      ) : null}
                    </div>
                    <Button
                      className={Style.addProductButton}
                      variant="contained"
                      color="primary"
                      onClick={AddToList}
                    >
                      {' '}
                      Add Product
                    </Button>
                  </Box>
                )
              })}
            </div>
          </Modal> */}
      </Box>
      <br />
      <br />

      <h3 style={{ fontWeight: 'bold', margin: '20px 0' }}>List Items</h3>
      {wishlistData?.items?.map((e: any, i: number) => {
        return (
          <WishlistItem
            key={i}
            item={e}
            deleteItem={deleteItem}
            changeQuantity={changeQuantity}
            wishlistId={wishlistData.id}
          />
        )
      })}
    </>
  )
}
export default EditWishlist
