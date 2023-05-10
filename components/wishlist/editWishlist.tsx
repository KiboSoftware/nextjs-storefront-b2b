import React, { useState } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import { Container, Grid } from '@mui/material'
import Image from 'next/image'

import WishlistItem from './wishlistItem'
import ProductSearch from '../common/ProductSearch/ProductSearch'
import { useProductSearchQueries, useWishlist } from '@/hooks'
import { useSearchSuggestionsQueries, useDebounce } from '@/hooks'
import { useUpdateWishlistMutation } from '@/hooks'

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

const ProductListItem = (props: any) => {
  function handleClick(e: any) {
    props.onClick(e)
  }
  return (
    <li className={Style.wishlistSearchLI}>
      {' '}
      <button className={Style.wishlistSearch} onClick={handleClick} value={props.code}>
        {props.image ? (
          <Image
            className={Style.wishlistSearchImage}
            src={`https:${props.image}`}
            alt={props.name}
            width={20}
            height={20}
          />
        ) : null}
        {props.name}
      </button>
    </li>
  )
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
  const [state, setState] = React.useState({
    productCode: '',
    quantity: '1',
    showSuggestions: false,
    name: wishlistData.name,
    openNameForm: false,
  })
  const [open, setOpen] = React.useState(false)
  let productSuggestionGroup

  const searchSuggestionResult = useSearchSuggestionsQueries(
    useDebounce(state.productCode.trim(), 300)
  )

  const [searchParams, setSearchParams] = React.useState({ search: state.productCode.trim() })
  const { data } = useProductSearchQueries(searchParams)

  const productData = data?.items?.filter((item) => item?.productCode === searchParams.search)

  if (state.showSuggestions) {
    const getSuggestionGroup = (title: string) =>
      searchSuggestionResult.data
        ? searchSuggestionResult.data?.suggestionGroups?.find((sg) => sg?.name === title)
        : null
    productSuggestionGroup = getSuggestionGroup('Pages')
  }
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
        setSearchParams({ search: e.target.value })
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
    console.log(e)
    setState((prevValue: any) => {
      return {
        ...prevValue,
        productCode: e.currentTarget.id,
      }
    })
    // setSearchParams({
    //     search: e.target.value
    // });
    // setOpen(true);
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
        <Container>
          <Grid container spacing={2}>
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
                      />
                      <Button
                        variant="contained"
                        onClick={() => setState({ ...state, openNameForm: false })}
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
                <Container style={{ justifyContent: 'space-between', display: 'flex' }}>
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => {
                      props.handleEditWishlist(false)
                      props.handleEditForm(false)
                    }}
                  >
                    {' '}
                    Cancel
                  </Button>
                  <Button variant="contained" size="medium" onClick={handleSaveWishlist}>
                    Save & Close
                  </Button>
                </Container>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {/* <form onSubmit={ handleSubmit } id="wishlist" style={{position: 'relative'}}>
                                <Grid container spacing={0.5} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} direction="row" justifyContent="flex-start" alignItems="top" >
                                    <Grid item xs={4}>
                                            <Typography variant='caption'>Search for a product</Typography>
                                            <input className={Style.inputBox}
                                             placeholder='Start typing to search' 
                                             id='productId' 
                                             onChange={ handleChange } 
                                             value={ state.productCode } />
                                        </Grid>
                                        {state.showSuggestions ? 
                                    <ul className={Style.wishlistSearchUl} style={{position: 'absolute', top: '100%', left: '0px'}}>
                                    {state.showSuggestions ? productSuggestionGroup?.suggestions?.map((item) => {
                                        return <ProductListItem  className="list"
                                                key={item?.suggestion?.product} 
                                                name={item?.suggestion?.content?.productName}
                                                code={item?.suggestion?.productCode}
                                                image={item?.suggestion?.productImageUrls? item?.suggestion?.productImageUrls[0]:null}
                                                item={item}
                                                onClick={handleProductItemClick}
                                            />
                                    }) : null}
                                    </ul> : null}
                                    <Grid item xs={2}>
                                        <p><strong>Product Quantity:</strong></p>
                                        <input className={Style.inputBox} placeholder='Quantity' id='productQty' onChange={ handleChange } value={ state.quantity } /></Grid>
                                    <Grid item xs={4} className={Style.addProductButton}><Button  variant='contained' color='primary' type='submit' form='wishlist'> Save List Name</Button></Grid>
                                </Grid>
                            </form> */}
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
          <Modal
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
          </Modal>
        </Container>
      </Box>
      <br />
      <br />

      <Container>
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
      </Container>
    </>
  )
}
export default EditWishlist
