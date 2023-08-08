import React, { ChangeEvent, useState } from 'react'

import { Search } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Input,
  InputAdornment,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'

import { KiboDialog } from '@/components/common'
import { ListTable } from '@/components/my-account'
import EditList from '@/components/my-account/Lists/EditList/EditList'
import { styles } from '@/components/my-account/Lists/ViewLists/ViewLists.style'
import { useAuthContext, useSnackbarContext } from '@/context'
import {
  PageProps,
  useCreateWishlist,
  useGetWishlist,
  useDeleteWishlist,
  useAddCartItem,
} from '@/hooks'

import { CrWishlist, Maybe, ProductOption, WishlistCollection } from '@/lib/gql/types'

interface ListsProps {
  onEditFormToggle: (param: boolean) => void
  isEditFormOpen: boolean
}

const ViewLists = (props: ListsProps) => {
  const { onEditFormToggle, isEditFormOpen } = props
  const { publicRuntimeConfig } = getConfig()
  const { createWishlist } = useCreateWishlist()
  const { deleteWishlist } = useDeleteWishlist()
  const { addToCart } = useAddCartItem()
  const { showSnackbar } = useSnackbarContext()

  // declaring states
  const [paginationState, setPaginationState] = useState<PageProps>({
    startIndex: publicRuntimeConfig.b2bList.startIndex,
    pageSize: publicRuntimeConfig.b2bList.pageSize,
    sortBy: publicRuntimeConfig.b2bList.sortBy,
    filter: publicRuntimeConfig.b2bList.filter,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listData, setListData] = useState<CrWishlist>()
  const [showDeleteDialog, setShowDeleteDialog] = useState({
    show: false,
    id: '',
  })

  // screen size declared
  const theme = useTheme()
  const mdScreen = useMediaQuery<boolean>(theme.breakpoints.up('md'))
  const { t } = useTranslation('common')
  // this will be used for creating new list
  const { user } = useAuthContext()
  const userId = user?.id
  const userUserId = user?.userId

  // fetching wishlist data
  const response = useGetWishlist(paginationState)
  const wishlistsResponse = response.data as WishlistCollection
  const isPending = response.isPending
  const refetch = response.refetch

  // copy list function
  const handleCopyList = async (id: string) => {
    const newWishlist =
      wishlistsResponse.items &&
      wishlistsResponse?.items.find((item: Maybe<CrWishlist>) => item?.id === id)
    let listName = newWishlist?.name + ' - copy'
    while (
      wishlistsResponse.items &&
      wishlistsResponse?.items.find((item: Maybe<CrWishlist>) => item?.name == listName)
    ) {
      listName += ' - copy'
    }
    setIsLoading(true)
    try {
      await createWishlist.mutateAsync({
        customerAccountId: userId,
        name: listName,
        items: newWishlist?.items,
      })
      showSnackbar('List Duplicated Successfully', 'success')
      await refetch()
    } catch (e: any) {
      alert(e?.message)
    }
    setIsLoading(false)
  }

  // delete list function
  const handleDeleteList = (id: string) => {
    setShowDeleteDialog((current) => ({ ...current, show: true, id }))
  }
  const deleteList = async () => {
    setIsLoading(true)
    await deleteWishlist.mutateAsync(showDeleteDialog.id)
    setIsLoading(false)
    setShowDeleteDialog((current) => ({ ...current, show: false, id: '' }))
    refetch()
  }

  // edit list function
  const handleEditList = async (id: string) => {
    const wishlist = wishlistsResponse?.items?.find(
      (item: Maybe<CrWishlist>) => item?.id === id
    ) as CrWishlist
    setListData(wishlist)
    onEditFormToggle(true)
  }

  // add list to cart
  const handleAddListToCart = async (id: string) => {
    const list = wishlistsResponse?.items?.find((item) => item?.id === id)
    setIsLoading(true)
    const promises: any[] = []
    try {
      list?.items?.forEach((item) => {
        promises.push(
          addToCart.mutateAsync({
            product: {
              productCode: item?.product?.productCode as string,
              options: item?.product?.options as ProductOption[],
            },
            quantity: item?.quantity as number,
          })
        )
      })
      await Promise.all(promises)
      showSnackbar('List added to cart', 'success')
      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
    }

    setIsLoading(false)
  }

  const handleInitiateQuote = (id: string) => {
    console.log('Work In Progress')
  }

  // handle filter for current user list
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaginationState({
      startIndex: publicRuntimeConfig.b2bList.startIndex,
      pageSize: publicRuntimeConfig.b2bList.pageSize,
      sortBy: publicRuntimeConfig.b2bList.sortBy,
      filter: e.currentTarget.checked ? `createBy eq ${userUserId}` : '',
    })
  }

  // on changing page number
  const handlePageChange = (e: ChangeEvent<unknown>, page: number) => {
    const newStartIndex = paginationState.pageSize * (page - 1)
    setPaginationState((currentState) => ({ ...currentState, startIndex: newStartIndex }))
  }

  if (!wishlistsResponse) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isEditFormOpen) {
    return (
      <EditList
        onEditFormToggle={onEditFormToggle}
        listData={listData}
        onUpdateListData={(res: CrWishlist) => {
          setListData(res)
        }}
      />
    )
  }

  return (
    <>
      <Box style={{ padding: '10px 10px 10px 0' }}>
        <FormControlLabel
          label={t('show-only-my-lists')}
          control={<Checkbox onChange={handleFilterChange} sx={{ fontSize: '16px' }} />}
          data-testid="currentUserFilterCheckbox"
        />
        {!mdScreen && (
          <>
            <FormControl
              sx={{
                width: '100%',
                borderBottom: 'none',
              }}
            >
              <Input
                placeholder={t('search-by-name')}
                sx={styles.customInput}
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </FormControl>
          </>
        )}
        {wishlistsResponse.items?.length === 0 ? (
          <Typography>No List found</Typography>
        ) : (
          <>
            <ListTable
              rows={wishlistsResponse.items as Array<CrWishlist>}
              isLoading={isPending || isLoading}
              onCopyList={handleCopyList}
              onDeleteList={handleDeleteList}
              onEditList={handleEditList}
              onAddListToCart={handleAddListToCart}
              onInitiateQuote={handleInitiateQuote}
            />
            <Pagination
              count={wishlistsResponse ? wishlistsResponse.pageCount : 1}
              shape={`rounded`}
              size="small"
              sx={{ marginTop: '15px' }}
              onChange={handlePageChange}
              data-testid="pagination"
            />
          </>
        )}
      </Box>
      <KiboDialog
        isOpen={showDeleteDialog.show}
        showCloseButton
        Title={''}
        isAlignTitleCenter={true}
        showContentTopDivider={false}
        showContentBottomDivider={false}
        Actions={''}
        Content={
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ marginBottom: '10px' }}>{t('delete-list-message')}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button variant="contained" sx={{ marginBottom: '10px' }} onClick={deleteList}>
                {t('delete')}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowDeleteDialog((current) => ({ ...current, show: false }))}
              >
                {t('cancel')}
              </Button>
            </Box>
          </Box>
        }
        customMaxWidth="480px"
        onClose={() => setShowDeleteDialog((current) => ({ ...current, show: false }))}
      />
    </>
  )
}

export default ViewLists
