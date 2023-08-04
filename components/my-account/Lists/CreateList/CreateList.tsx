import React, { FormEvent, useState } from 'react'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Button, useMediaQuery, useTheme, IconButton, Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import ProductSearch from '@/components/b2b/B2BProductSearch/B2BProductSearch'
import { KiboTextBox } from '@/components/common'
import styles from '@/components/my-account/Lists/CreateList/CreateList.style'
import ListItem from '@/components/my-account/Lists/ListItem/ListItem'
import { useAuthContext } from '@/context'
import { useCreateWishlist, useGetWishlist } from '@/hooks'

import { Product } from '@/lib/gql/types'

export interface CreateListProps {
  openCreateForm: (param: boolean) => void
}

interface CreateListState {
  name: string
  items: [
    {
      product: {
        productCode: string
      }
      quantity: number
    }
  ]
}

const CreateList = (props: CreateListProps) => {
  const { openCreateForm } = props
  const [listState, setListState] = useState<CreateListState>({
    name: '',
    items: [{ product: { productCode: '' }, quantity: 0 }],
  })
  const [productList, setProductList] = useState<Product[]>([])

  const theme = useTheme()
  const mdScreen = useMediaQuery<boolean>(theme.breakpoints.up('md'))
  const router = useRouter()
  const { t } = useTranslation('common')
  const { user } = useAuthContext()
  const { createWishlist } = useCreateWishlist()
  const { refetch } = useGetWishlist()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const finalList = listState.items
    finalList.shift()
    debugger
    await createWishlist
      .mutateAsync({
        customerAccountId: user?.id,
        name: listState.name,
        items: finalList,
      })
      .catch((e) => {
        console.log(e)
        alert('error occured')
      })
    await refetch()
    setListState({ name: '', items: [{ product: { productCode: '' }, quantity: 0 }] })
    openCreateForm(false)
  }

  const handleAddProduct = (product?: Product) => {
    console.log(product)
    // setting state for creation of list in backend
    const { items } = listState
    const item = {
      product: {
        productCode: product?.productCode as string,
      },
      quantity: 1,
    }
    items.push(item)
    setListState((currentState) => ({ ...currentState, items: items }))
    // setting state to show the products below
    setProductList((currentVal) => [...currentVal, product as Product])
  }

  const handleListNameChange = (e: string, userEnteredValue: string) => {
    setListState((currentVal) => ({ ...currentVal, name: userEnteredValue }))
  }

  return (
    <>
      <Box style={{ width: '100%' }}>
        {mdScreen ? (
          <IconButton
            style={{ paddingLeft: 0, fontSize: '14px', color: '#000' }}
            onClick={() => {
              router.push('/my-account')
            }}
          >
            <ArrowBackIosIcon style={{ width: '14px', color: '#000' }} />
            {t('my-account')}
          </IconButton>
        ) : null}
        <Typography
          variant="h1"
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
              <Box sx={{ fontSize: '28px', marginRight: 'auto', display: 'inline' }}>
                {t('create-new-list')}
              </Box>
              <Box sx={{ display: 'inline' }}>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => {
                    openCreateForm(false)
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  form="wishlist-form"
                  style={{ boxShadow: 'none', marginLeft: '9px' }}
                  disabled={listState.name.length === 0}
                >
                  {t('save-and-close')}
                </Button>
              </Box>
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
              <Box sx={{ marginLeft: 'auto', marginRight: 'auto', display: 'inline' }}>
                {t('create-new-list')}
              </Box>
            </>
          )}
        </Typography>
      </Box>
      <Box>
        <form
          onSubmit={handleSubmit}
          style={{ margin: '10px auto', width: '360px', marginLeft: 0 }}
          id="wishlist-form"
        >
          <Box sx={{ ...styles.listSection, flexDirection: 'column' }}>
            <KiboTextBox
              placeholder={t('name-this-list')}
              name="listName"
              value={listState.name}
              onChange={handleListNameChange}
              label={t('list-name')}
              sx={{ maxWidth: '360px' }}
            />
          </Box>
          <Box sx={{ maxWidth: '360px' }}>
            <ProductSearch onAddProduct={handleAddProduct} />
          </Box>
        </form>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          {t('list-items')}
        </Typography>
        {productList.map((product: Product) => (
          <ListItem
            key={product.productCode}
            item={{
              product: {
                productName: product?.content?.productName,
                productCode: product.productCode,
                price: product.price,
                productImage:
                  (product?.content?.productImages?.length as number) > 0 &&
                  product?.content?.productImages?.[0]?.imageUrl,
                productImageAltText:
                  (product?.content?.productImages?.length as number) > 0 &&
                  product?.content?.productImages?.[0]?.altText,
              },
              quantity: 1,
            }}
          />
        ))}
        {!mdScreen && (
          <>
            <Box>
              <Button
                variant="outlined"
                type="button"
                onClick={() => {
                  openCreateForm(false)
                }}
                style={{ width: '100%' }}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="contained"
                type="submit"
                form="wishlist-form"
                style={{ width: '100%', marginTop: '8px', boxShadow: 'none' }}
                disabled={listState.name.length === 0}
              >
                {t('save-and-close')}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  )
}

export default CreateList