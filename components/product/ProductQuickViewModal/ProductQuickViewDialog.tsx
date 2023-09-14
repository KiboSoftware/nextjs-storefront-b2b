import React from 'react'

import { Button, Stack, Theme, useMediaQuery } from '@mui/material'

import { productQuickViewDialogStyle } from './ProductQuickViewDialog.style'
import KiboDialog from '@/components/common/KiboDialog/KiboDialog'
import { ProductDetailTemplate } from '@/components/page-templates'
import { useModalContext } from '@/context/ModalContext'
import { useProductCardActions, useUpdateWishlistMutation } from '@/hooks'
import { productGetters } from '@/lib/getters'
import { updateWishlistItemQuantityMutation } from '@/lib/gql/mutations'
import type { ProductCustom } from '@/lib/types'

import { CrProductOption, CrWishlist, CrWishlistInput, Product } from '@/lib/gql/types'

interface ProductQuickViewDialogProps {
  product: ProductCustom
  isQuickViewModal?: boolean
  dialogProps?: any
  quoteDetails?: any
  listData?: any
  onUpdateListData: (param: CrWishlist) => void
}

const ProductQuickViewDialogFooter = (props: any) => {
  const {
    cancel,
    addItemToCart,
    addItemToList,
    addItemToQuote,
    onClose,
    isValidateAddToCart,
    isValidateAddToWishlist,
    currentProduct,
    addToCartPayload,
    quoteDetails,
    listData,
    onUpdateListData,
  } = props
  const { handleAddToCart, handleWishList, handleAddToQuote } = useProductCardActions()
  const mdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const handleAddProductToCart = () => {
    handleAddToCart(addToCartPayload, false)
    onClose()
  }
  const { updateWishlist } = useUpdateWishlistMutation()
  const handleAddProductToList = async () => {
    // handleWishList(currentProduct)
    const items = listData?.items
    items?.push({
      product: {
        options: addToCartPayload?.product?.options as CrProductOption[],
        productCode: productGetters.getProductId(addToCartPayload?.product as Product),
        variationProductCode: productGetters.getVariationProductCode(
          addToCartPayload?.product as Product
        ),
        isPackagedStandAlone: addToCartPayload?.product?.isPackagedStandAlone,
      },
      quantity: 1,
    })
    if (listData) listData.items = items
    const payload = {
      wishlistId: listData?.id as string,
      wishlistInput: listData as CrWishlistInput,
    }
    const response = await updateWishlist.mutateAsync(payload)
    onUpdateListData(response.updateWishlist)
    onClose()
  }

  const handleAddProductToQuote = () => {
    const { quoteId, updateMode } = quoteDetails
    handleAddToQuote(quoteId, updateMode, addToCartPayload?.product, addToCartPayload?.quantity)
    onClose()
  }

  return (
    <Stack {...(!mdScreen && { spacing: 2 })} sx={{ ...productQuickViewDialogStyle.footer }}>
      <Button
        variant="contained"
        color="secondary"
        {...(!mdScreen && { fullWidth: true })}
        onClick={onClose}
      >
        {cancel}
      </Button>
      {addItemToCart && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProductToCart}
          {...(!mdScreen && { fullWidth: true })}
          {...(!isValidateAddToCart && { disabled: true })}
        >
          {addItemToCart}
        </Button>
      )}
      {addItemToList && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProductToList}
          {...(!mdScreen && { fullWidth: true })}
          {...(!isValidateAddToWishlist && { disabled: true })}
        >
          {addItemToList}
        </Button>
      )}
      {addItemToQuote && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProductToQuote}
          {...(!mdScreen && { fullWidth: true })}
          {...(!isValidateAddToCart && { disabled: true })}
        >
          {addItemToQuote}
        </Button>
      )}
    </Stack>
  )
}

const ProductQuickViewDialog = (props: ProductQuickViewDialogProps) => {
  const { product, isQuickViewModal, dialogProps, quoteDetails, listData, onUpdateListData } = props
  const {
    title,
    cancel,
    addItemToCart,
    addItemToList,
    addItemToQuote,
    isB2B = false,
  } = dialogProps || {} //isB2B to showDialog
  const { closeModal } = useModalContext()
  const [currentProduct, setCurrentProduct] = React.useState<any>(null)
  const [addToCartPayload, setAddToCartPayload] = React.useState<any>(null)
  const [isValidateAddToCart, setIsValidateAddToCart] = React.useState<boolean>(false)
  const [isValidateAddToWishlist, setIsValidateAddToWishlist] = React.useState<boolean>(false)

  const handleCurrentProduct = (
    addToCartPayload: any,
    currentProduct: ProductCustom,
    isValidateAddToCart: boolean,
    isValidateAddToWishlist: boolean
  ) => {
    setCurrentProduct(currentProduct)
    setAddToCartPayload(addToCartPayload)
    setIsValidateAddToCart(isValidateAddToCart)
    setIsValidateAddToWishlist(isValidateAddToWishlist)
  }

  return (
    <KiboDialog
      showCloseButton
      showContentTopDivider={isB2B}
      showContentBottomDivider={isB2B}
      Title={title}
      Actions={
        cancel &&
        (addItemToCart || addItemToList || addItemToQuote) && (
          <ProductQuickViewDialogFooter
            cancel={cancel}
            addItemToCart={addItemToCart}
            addItemToList={addItemToList}
            addItemToQuote={addItemToQuote}
            onClose={closeModal}
            isValidateAddToCart={isValidateAddToCart}
            isValidateAddToWishlist={isValidateAddToWishlist}
            addToCartPayload={addToCartPayload}
            currentProduct={currentProduct}
            quoteDetails={quoteDetails}
            listData={listData}
            onUpdateListData={onUpdateListData}
          />
        )
      }
      Content={
        <ProductDetailTemplate
          product={product}
          isQuickViewModal={isQuickViewModal}
          isB2B={isB2B}
          getCurrentProduct={handleCurrentProduct}
        />
      }
      customMaxWidth="80rem"
      onClose={closeModal}
    />
  )
}

export default ProductQuickViewDialog
