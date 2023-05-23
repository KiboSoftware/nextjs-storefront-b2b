import React from 'react'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { Button, Container, IconButton } from '@mui/material'

import styles from './wishlist.module.css'
import ProductSearch from '../common/ProductSearch/ProductSearch'
import { useAuthContext } from '@/context'
import { useCreateWishlist } from '@/hooks'
const CreateWishlist = (props: any) => {
  const { user } = useAuthContext()
  const { createCustomWishlist } = useCreateWishlist()
  const [state, setState] = React.useState({ name: '' })
  // const [openForm, setOpenForm] = React.useState(false);
  function handleSubmit(e: any) {
    e.preventDefault()
    createCustomWishlist.mutateAsync({
      customerAccountId: user?.id,
      name: state.name,
    })
    setState({ name: '' })
    // setOpenForm(false);
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
      <div>
        <form onSubmit={handleSubmit} style={{ margin: '10px auto' }}>
          <div className={`${styles.createListHeaderSection}`}>
            <h1 className={`${styles.createListHeading}`}>Create New List</h1>
            <div>
              <Button
                variant="outlined"
                type="button"
                className={`${styles.cancelListButton}`}
                onClick={() => {
                  props.handleCreateWishlist(false)
                }}
              >
                Cancel
              </Button>
              <Button variant="contained" type="submit" className={`${styles.saveListButton}`}>
                Save & Close
              </Button>
            </div>
          </div>
          <div className={`${styles.createListNameSection}`}>
            <label htmlFor="listName">List Name</label>
            <input
              className={`${styles.createListNameInput}`}
              placeholder="Name the list"
              name="listName"
              value={state.name}
              onChange={handleChange}
            />
          </div>
          <ProductSearch />
          <div>
            <div className={`${styles.listItemHeadingSection}`}>
              <h2 className={`${styles.listItemHeading}`}>List items</h2>
              <Button variant="text" className={`${styles.addAllItemToCart}`}>
                Add All Items to Cart
              </Button>
            </div>
            <p className={`${styles.noListItem}`}>Search to start adding products to the list </p>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateWishlist
