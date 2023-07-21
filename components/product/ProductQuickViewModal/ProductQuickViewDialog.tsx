import React from 'react'

import { Button, Stack, Theme, useMediaQuery } from '@mui/material'

import { productQuickViewDialogStyle } from './ProductQuickViewDialog.style'
import KiboDialog from '@/components/common/KiboDialog/KiboDialog'
import { ProductDetailTemplate } from '@/components/page-templates'
import { useModalContext } from '@/context/ModalContext'
import { useProductCardActions } from '@/hooks'
import type { ProductCustom } from '@/lib/types'

interface ProductQuickViewDialogProps {
  product: ProductCustom
  isQuickViewModal?: boolean
  dialogProps?: any
}

const ProductQuickViewDialogFooter = (props: any) => {
  const {
    cancel,
    addItemToCart,
    addItemToList,
    onClose,
    isValidateAddToCart,
    isValidateAddToWishlist,
    currentProduct,
    addToCartPayload,
  } = props
  const { handleAddToCart, handleWishList } = useProductCardActions()
  const mdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const handleAddProductToCart = () => {
    handleAddToCart(addToCartPayload, false)
    onClose()
  }

  const handleAddProductToList = () => {
    handleWishList(currentProduct)
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
    </Stack>
  )
}

const ProductQuickViewDialog = (props: ProductQuickViewDialogProps) => {
  const { product, isQuickViewModal, dialogProps } = props
  const { title, cancel, addItemToCart, addItemToList, isB2B = false } = dialogProps || {} //isB2B to showDialog
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
        (addItemToCart || addItemToList) && (
          <ProductQuickViewDialogFooter
            cancel={cancel}
            addItemToCart={addItemToCart}
            addItemToList={addItemToList}
            onClose={closeModal}
            isValidateAddToCart={isValidateAddToCart}
            isValidateAddToWishlist={isValidateAddToWishlist}
            addToCartPayload={addToCartPayload}
            currentProduct={currentProduct}
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
