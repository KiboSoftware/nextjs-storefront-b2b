import React, { FormEvent, useState } from 'react'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Button, useMediaQuery, useTheme, IconButton, Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { B2BProductSearch, ListItem } from '@/components/b2b'
import styles from '@/components/b2b/Lists/CreateList/CreateList.style'
import { KiboTextBox } from '@/components/common'
import { useAuthContext } from '@/context'
import { useCreateWishlist, useProductCardActions } from '@/hooks'
import { productGetters } from '@/lib/getters'
import { ProductCustom } from '@/lib/types'

import { CrProductOption, CrProductPrice, CrWishlistItem, Product } from '@/lib/gql/types'

export interface CreateListProps {
  onCreateFormToggle: (param: boolean) => void
}

type CreateListItems = {
  product: {
    productCode: string
  }
  quantity: number
}
interface CreateListState {
  name: string
  items: CreateListItems[]
}

const CreateList = (props: CreateListProps) => {
  const { onCreateFormToggle } = props
  const [listState, setListState] = useState<CreateListState>({
    name: '',
    items: [],
  })
  const [productList, setProductList] = useState<CrWishlistItem[]>([])
  const { openProductQuickViewModal } = useProductCardActions()

  const theme = useTheme()
  const mdScreen = useMediaQuery<boolean>(theme.breakpoints.up('md'))
  const router = useRouter()
  const { t } = useTranslation('common')
  const { user } = useAuthContext()
  const { createWishlist } = useCreateWishlist()

  const onUpdateListData = (product: any) => {
    const { items } = listState
    const item = {
      product: {
        productCode: product?.productCode as string,
        variationProductCode: product?.variationProductCode as string,
        options: product?.options?.map((option: any) => {
          const selected = option?.values?.find((value: any) => value?.isSelected)
          return {
            name: option?.attributeDetail?.name,
            value: selected?.value || selected?.stringValue || selected?.shopperEnteredValue,
            attributeFQN: option?.attributeFQN,
          }
        }) as CrProductOption[],
        isPackagedStandAlone: product?.isPackagedStandAlone,
        price: product?.price,
        imageUrl: productGetters.getCoverImage(product),
        name: productGetters.getName(product),
        description: productGetters.getDescription(product),
      },
      quantity: 1,
    }
    items.push(item)

    // converting product to CrWishlistItem
    const crWishlistProduct: CrWishlistItem = {
      quantity: 1,
      product: {
        productCode: product?.productCode,
        variationProductCode: product?.variationProductCode,
        options: product?.options?.map((option: any) => {
          const selected = option?.values?.find((value: any) => value?.isSelected)
          return {
            name: option?.attributeDetail?.name,
            value: selected?.value || selected?.stringValue || selected?.shopperEnteredValue,
            attributeFQN: option?.attributeFQN,
          }
        }) as CrProductOption[],
        isPackagedStandAlone: product?.isPackagedStandAlone,
        price: product?.price,
        imageUrl: productGetters.getCoverImage(product),
        name: productGetters.getName(product),
        description: productGetters.getDescription(product),
      },
    }

    setListState((currentState) => ({ ...currentState, items: items }))
    // setting state to show the products below
    setProductList((currentVal) => [...currentVal, crWishlistProduct])
  }
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await createWishlist.mutateAsync({
        customerAccountId: user?.id,
        name: listState.name,
        items: listState.items,
      })
      setListState({ name: '', items: [] })
      onCreateFormToggle(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleAddProduct = (product?: Product) => {
    // setting state for creation of list in backend
    if (productGetters.isVariationProduct(product as Product)) {
      const dialogProps = {
        title: t('product-configuration-options'),
        cancel: t('cancel'),
        addItemToList: t('add-item-to-list'),
        isB2B: true,
        listMode: 'create',
      }
      openProductQuickViewModal({
        product: product as ProductCustom,
        dialogProps,
        onUpdateListData,
      })
    } else {
      const { items } = listState
      const item = {
        product: {
          productCode: product?.productCode as string,
          variationProductCode: product?.variationProductCode as string,
          options: product?.options as CrProductOption[],
          isPackagedStandAlone: product?.isPackagedStandAlone,
          price: product?.price as CrProductPrice,
          imageUrl:
            (product?.content?.productImages?.length as number) > 0
              ? (product?.content?.productImages?.[0]?.imageUrl as string)
              : '',
          name: product?.content?.productName as string,
          description: product?.content?.productFullDescription as string,
        },
        quantity: 1,
      }
      items.push(item)

      // converting product to CrWishlistItem
      const crWishlistProduct: CrWishlistItem = {
        quantity: 1,
        product: {
          productCode: product?.productCode,
          variationProductCode: product?.variationProductCode,
          options: product?.options as CrProductOption[],
          isPackagedStandAlone: product?.isPackagedStandAlone,
          price: product?.price as CrProductPrice,
          imageUrl:
            (product?.content?.productImages?.length as number) > 0
              ? (product?.content?.productImages?.[0]?.imageUrl as string)
              : '',
          name: product?.content?.productName as string,
          description: product?.content?.productFullDescription as string,
        },
      }

      setListState((currentState) => ({ ...currentState, items: items }))
      // setting state to show the products below
      setProductList((currentVal) => [...currentVal, crWishlistProduct])
    }
  }

  const handleListNameChange = (e: string, userEnteredValue: string) => {
    setListState((currentVal) => ({ ...currentVal, name: userEnteredValue }))
  }

  const handleDeleteItem = (id: string) => {
    const items: any = listState.items.filter((item) => {
      return item.product.productCode !== id
    })
    setListState((currentState) => ({ ...currentState, items: items }))
    setProductList((currentState) =>
      currentState.filter((item: CrWishlistItem) => item.product?.productCode !== id)
    )
  }

  const handleChangeQuantity = (id: string, quantity: number) => {
    const item = listState.items.find((item) => item.product.productCode === id)
    if (item?.quantity) item.quantity = quantity
  }

  return (
    <>
      <Box>
        {mdScreen && (
          <Button
            data-testid="my-account-button"
            sx={{ paddingLeft: 0, fontSize: '14px', color: '#000' }}
            onClick={() => {
              router.push('/my-account')
            }}
            startIcon={<ArrowBackIosIcon sx={{ width: '14px' }} />}
          >
            {t('my-account')}
          </Button>
        )}
        <Typography
          variant="h3"
          sx={{ ...styles.heading, margin: mdScreen ? '20px 0' : '0px 10px 0px 0px' }}
          fontWeight={'bold'}
        >
          {mdScreen ? (
            <>
              <Box sx={{ fontSize: '28px', marginRight: 'auto', display: 'inline' }}>
                {t('create-new-list')}
              </Box>
              <Box component="span" gap={2} display="inline-flex">
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={() => {
                    onCreateFormToggle(false)
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  form="wishlist-form"
                  disabled={listState.name.length === 0}
                >
                  {t('save-and-close')}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <IconButton
                sx={{ paddingLeft: 0, marginLeft: 0 }}
                data-testid="my-account-button"
                onClick={() => {
                  router.push('/my-account')
                }}
              >
                <ArrowBackIosIcon sx={{ width: '14px', color: '#000' }} />
              </IconButton>
              <Box sx={{ marginLeft: 'auto', marginRight: 'auto', display: 'inline' }}>
                {t('create-new-list')}
              </Box>
            </>
          )}
        </Typography>
      </Box>
      <Box>
        <form onSubmit={handleSubmit} style={styles.nameForm} id="wishlist-form">
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
            <B2BProductSearch onAddProduct={handleAddProduct} />
          </Box>
        </form>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          {t('list-items')}
        </Typography>
        {productList.length === 0 ? (
          <Typography variant="body2" color="GrayText" marginTop="20px">
            {t('no-item-in-list-text')}
          </Typography>
        ) : (
          productList.map((item: CrWishlistItem) => (
            <ListItem
              key={item.product?.productCode as string}
              item={item}
              onDeleteItem={handleDeleteItem}
              onChangeQuantity={handleChangeQuantity}
            />
          ))
        )}
        {!mdScreen && (
          <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={'20px'}>
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={() => {
                onCreateFormToggle(false)
              }}
              sx={{ width: '100%' }}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="contained"
              type="submit"
              form="wishlist-form"
              sx={{ width: '100%' }}
              disabled={listState.name.length === 0}
            >
              {t('save-and-close')}
            </Button>
          </Box>
        )}
      </Box>
    </>
  )
}

export default CreateList
