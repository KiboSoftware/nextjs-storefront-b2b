import { useState } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import { Box, Button, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Container, Grid } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { Maybe } from 'yup/lib/types'

import ProductSearch from '@/components/b2b/B2BProductSearch/B2BProductSearch'
import ListItem from '@/components/my-account/Lists/ListItem/ListItem'
import { useUpdateWishlistMutation } from '@/hooks'

import { CrWishlist, CrWishlistItem } from '@/lib/gql/types'

export interface EditWishlistProps {
  onEditFormToggle: (param: boolean) => void
  listData: CrWishlist | undefined
  onUpdateListData: (param: CrWishlist) => void
}

interface EditListState {
  productCode: Maybe<string>
  quantity: Maybe<string>
  showSuggestions: boolean
  name: Maybe<string>
  openNameForm: boolean
}

const EditList = (props: EditWishlistProps) => {
  const { onEditFormToggle, listData, onUpdateListData } = props

  const [editListState, setEditListState] = useState<EditListState>({
    productCode: '',
    quantity: '1',
    showSuggestions: false,
    name: listData?.name,
    openNameForm: false,
  })
  const theme = useTheme()
  const mdScreen = useMediaQuery<boolean>(theme.breakpoints.up('md'))
  const { t } = useTranslation('common')
  const { updateWishlist } = useUpdateWishlistMutation()

  const handleSaveWishlist = async () => {
    if (listData) listData.name = editListState.name
    const payload = {
      wishlistId: listData?.id,
      wishlistInput: listData,
    }
    console.log('items ==>', payload)
    const response = await updateWishlist.mutateAsync(payload)
    console.log(response)
    onUpdateListData(response.updateWishlist)
    onEditFormToggle(false)
  }

  const handleDeleteItem = async (id: string) => {
    try {
      let items = listData?.items
      items = items?.filter((item: Maybe<CrWishlistItem>) => item?.id !== id)
      if (listData) listData.items = items
      const payload = {
        wishlistId: listData?.id,
        wishlistInput: listData,
      }
      const response = await updateWishlist.mutateAsync(payload)
      onUpdateListData(response.updateWishlist)
    } catch (e) {
      console.log('error', e)
    }
  }

  const handleChangeQuantity = (id: string, quantity: number) => {
    const items = listData?.items
    const currentItem = items?.find((item: Maybe<CrWishlistItem>) => item?.id === id)
    if (currentItem) currentItem.quantity = quantity
  }

  const handleProductItemClick = async (product?: any) => {
    const items = listData?.items
    const item = items?.find((i: any) => i.product.productCode === product.productCode)
    if (item) {
      console.log('update quantity')
      item.quantity += 1
    } else {
      console.log('add new entry for item')
      items?.push({ product: { productCode: product.productCode }, quantity: 1 })
    }
    if (listData) listData.items = items
    const payload = {
      wishlistId: listData?.id,
      wishlistInput: listData,
    }
    const response = await updateWishlist.mutateAsync(payload)
    onUpdateListData(response.updateWishlist)
  }

  return (
    <>
      <Box style={{ marginTop: '30px' }}>
        <Grid>
          <Grid
            container
            spacing={0.5}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item xs={mdScreen ? 9 : 12}>
              {editListState.openNameForm ? (
                <>
                  <form>
                    <input
                      onChange={(e) => setEditListState({ ...editListState, name: e.target.value })}
                      value={editListState.name || ''}
                      style={{
                        maxWidth: '495px',
                        height: '36px',
                        fontSize: ' 14px',
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid #cdcdcd',
                        borderRadius: ' 4px',
                      }}
                      id="editNameInput"
                    />
                    <Button
                      variant="contained"
                      onClick={() => setEditListState({ ...editListState, openNameForm: false })}
                      style={{ marginLeft: '5px' }}
                      id="saveNameBtn"
                    >
                      Save
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Typography variant="h3">
                    {editListState.name}
                    <IconButton
                      onClick={() => setEditListState({ ...editListState, openNameForm: true })}
                      id="editNameBtn"
                    >
                      <EditIcon />
                    </IconButton>
                  </Typography>
                </>
              )}
            </Grid>
            {mdScreen ? (
              <>
                <Grid
                  item
                  xs={3}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Container style={{ justifyContent: 'end', display: 'flex' }}>
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() => onEditFormToggle(false)}
                      style={{ marginRight: '10px' }}
                    >
                      Cancel
                    </Button>
                    <Button variant="contained" size="medium" onClick={handleSaveWishlist}>
                      Save & Close
                    </Button>
                  </Container>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ maxWidth: '360px' }}>
              <ProductSearch onAddProduct={handleProductItemClick} />
            </Box>
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
      </Box>
      <br />
      <br />

      <Typography variant="h3" style={{ fontWeight: 'bold', margin: '20px 0' }}>
        List Items
      </Typography>
      {listData?.items?.map((item: any, i: number) => {
        return (
          <ListItem
            key={i}
            item={{
              product: {
                productName: item.product.name,
                productCode: item.product.productCode,
                price: item.product.price,
                productImage: item.product.imageUrl,
                productImageAltText: item.product.name,
                lineId: item.id,
              },
              quantity: item.quantity,
            }}
            onDeleteItem={handleDeleteItem}
            onChangeQuantity={handleChangeQuantity}
            listId={listData.id}
          />
        )
      })}
      {!mdScreen ? (
        <>
          <Grid
            item
            xs={12}
            style={{
              width: '100%',
              position: 'fixed',
              left: '50%',
              bottom: '0px',
              transform: 'translateX(-50%)',
              padding: '15px',
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="outlined"
              size="medium"
              onClick={() => onEditFormToggle(false)}
              style={{ width: '100%' }}
            >
              {t('cancle')}
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={handleSaveWishlist}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {t('save-and-close')}
            </Button>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default EditList