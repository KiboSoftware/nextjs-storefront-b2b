import React from 'react'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Button, useMediaQuery, useTheme, IconButton } from '@mui/material'
import { useRouter } from 'next/router'

import ProductSearch from '@/components/common/ProductSearch/ProductSearch'
// import styles from '@/components/wishlist/wishlist.module.css'
import { useAuthContext } from '@/context'
import { useCreateWishlist } from '@/hooks'

const CreateWishlist = (props: any) => {
  const { user } = useAuthContext()
  const { createCustomWishlist } = useCreateWishlist()

  const [state, setState] = React.useState({
    name: '',
    items: [{ product: { productCode: '' }, quantity: 0 }],
  })
  const theme = useTheme()
  const mdScreen = useMediaQuery<any>(theme.breakpoints.up('md'))
  const router = useRouter()

  function handleSubmit(e: any) {
    e.preventDefault()
    const finalList = state.items
    finalList.shift()
    createCustomWishlist
      .mutateAsync({
        customerAccountId: user?.id,
        name: state.name,
        items: finalList,
      })
      .catch((e) => {
        console.log(e)
        alert('error occured')
      })
    setState({ name: '', items: [{ product: { productCode: '' }, quantity: 0 }] })
    props.handleCreateWishlist(false)
  }

  function handleChange(e: any) {
    switch (e.target.name) {
      case 'listName':
        setState((prev) => {
          return { ...prev, name: e.target.value }
        })
        break
      default:
        console.log('default')
    }
  }
  return (
    <>
      <div style={{ width: '100%' }}>
        {mdScreen ? (
          <IconButton
            style={{ paddingLeft: 0, fontSize: '14px', color: '#000' }}
            onClick={() => {
              router.push('/my-account')
            }}
          >
            <ArrowBackIosIcon style={{ width: '14px', color: '#000' }} />
            My Account
          </IconButton>
        ) : null}
        <h1
          style={{
            textAlign: 'center',
            fontSize: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {mdScreen ? (
            <>
              <span style={{ fontSize: '28px', marginRight: 'auto' }}>Create New List</span>
              <span>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => {
                    props.handleCreateWishlist(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  form="wishlist-form"
                  style={{ boxShadow: 'none', marginLeft: '9px' }}
                >
                  Save & Close
                </Button>
              </span>
            </>
          ) : (
            <>
              <IconButton
                style={{ paddingLeft: 0, marginLeft: 0 }}
                onClick={() => {
                  router.push('/my-account')
                }}
              >
                <ArrowBackIosIcon style={{ width: '14px', color: '#000' }} />
              </IconButton>
              <span style={{ marginLeft: 'auto', marginRight: 'auto' }}> Create New List </span>
            </>
          )}
        </h1>
      </div>
      <div>
        <form onSubmit={handleSubmit} style={{ margin: '10px auto' }} id="wishlist-form">
          <div
          //  className={`${styles.createListNameSection}`}
          >
            <label htmlFor="listName">List Name</label>
            <input
              // className={`${styles.createListNameInput}`}
              placeholder="Name this list"
              name="listName"
              value={state.name}
              onChange={handleChange}
            />
          </div>
          <ProductSearch
            handleProductItemClick={(e: any) =>
              setState((prev) => {
                const newList = state.items
                newList.push({ product: { productCode: e.target.id }, quantity: 1 })
                return prev
              })
            }
          />
          {/* <div>
            <div className={`${styles.listItemHeadingSection}`}>
              <h2 className={`${styles.listItemHeading}`}>List items</h2>
              <Button variant="text" className={`${styles.addAllItemToCart}`}>
                Add All Items to Cart
              </Button>
            </div>
            <p className={`${styles.noListItem}`}>Search to start adding products to the list </p>
          </div> */}
        </form>
        {mdScreen ? (
          <></>
        ) : (
          <>
            <div>
              <Button
                variant="outlined"
                type="button"
                onClick={() => {
                  props.handleCreateWishlist(false)
                }}
                style={{ width: '100%' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                form="wishlist-form"
                style={{ width: '100%', marginTop: '8px', boxShadow: 'none' }}
              >
                Save & Close
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CreateWishlist
