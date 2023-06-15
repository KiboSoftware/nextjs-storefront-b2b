import { useEffect, useState, MouseEvent, ChangeEvent } from 'react'

import {
  Container,
  FormControlLabel,
  useTheme,
  Checkbox,
  useMediaQuery,
  CircularProgress,
  Box,
} from '@mui/material'

import EditWishlist from './EditWishlist/editWishlist'
import styles from './wishlist.module.css'
import WishlistTable from './WishlistTable/WishlistTable'
import { ConfirmationDialog } from '@/components/dialogs'
import { useAuthContext, useModalContext } from '@/context'
import { useAllWishlistsQueries, useCreateWishlist } from '@/hooks'
import { useDeleteWishlistMutation } from '@/hooks/mutations/useWishlistMutations/useDeleteWishlistMutation/useDeleteWishlistMutation'

const Wishlist = (props: any) => {
  const { user } = useAuthContext()
  const { createCustomWishlist } = useCreateWishlist()
  const { deleteWishlist } = useDeleteWishlistMutation()
  const { showModal } = useModalContext()
  const theme = useTheme()
  const mdScreen = useMediaQuery<any>(theme.breakpoints.up('md'))
  const [wishlistData, setWishlistData] = useState()
  const [listFilter, setListFilter] = useState('')
  const [page, setPage] = useState(1)
  const [startIndex, setStartIndex] = useState(0)
  const [hiddenColumns, setHiddenColumns] = useState({
    createdBy: true,
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const userID = user?.userId
  const pageSize = 5
  const [updateWishlist, setUpdateWishlist] = useState<boolean>(false)

  const [editList, setEditList] = useState(false)
  useEffect(() => {
    setStartIndex(pageSize * (page - 1))
    setHiddenColumns({
      createdBy: mdScreen,
    })
  }, [page, listFilter, mdScreen])

  function checkboxHandleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const filter = 'createBy eq ' + userID
      setListFilter(filter)
    } else {
      setListFilter('')
    }
  }
  const { data, isLoading } = useAllWishlistsQueries({
    pageSize,
    startIndex,
    sortBy: 'createDate desc',
    filter: listFilter,
  })

  const rows = data?.items?.map((item: any) => {
    return {
      ...item,
      createDate: getDate(item.auditInfo.createDate),
      createBy: item.auditInfo.createBy,
    }
  })
  console.log(rows)

  const totalCount = data?.totalCount
  const pageCount = parseInt(
    (totalCount % pageSize === 0 ? totalCount / pageSize : totalCount / pageSize + 1).toString()
  )

  const listData = data?.items

  function handleEditToWishlist(e: MouseEvent) {
    const wishlist: any = listData?.find((item: any) => item.id === e.currentTarget.id)
    setWishlistData(wishlist)
    setEditList(true)
    props.handleEditForm(true)
  }
  function getDate(date: number) {
    const d = new Date(date)
    const dateString = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    return dateString
  }

  function handleCopyWishlist(e: MouseEvent) {
    e.preventDefault()
    const wishlist: any = listData?.find((item: any) => item.id === e.currentTarget.id)
    let listName = wishlist?.name + '-copy'
    if (listData?.find((item: any) => item.name === listName)) {
      listName = listName + '-copy'
    }
    createCustomWishlist.mutateAsync({
      customerAccountId: user?.id,
      name: listName,
      items: wishlist?.items,
    })
  }
  function deleteWishlistEvent(e: MouseEvent) {
    setDeleteModalOpen(true)
    const wishlistId = e.currentTarget.id
    console.log(wishlistId)
    showModal({
      Component: ConfirmationDialog,
      props: {
        contentText: 'Are you sure want to delete this wishlist?',
        primaryButtonText: 'Delete',
        onConfirm: () => {
          console.log(wishlistId)
          deleteWishlist.mutateAsync(wishlistId)
          setDeleteModalOpen(false)
        },
      },
    })
  }
  if (editList === true) {
    return (
      <>
        <EditWishlist
          handleEditForm={props.handleEditForm}
          data={wishlistData}
          handleEditWishlist={setEditList}
          updateWishlistData={(res: any) => setWishlistData(res)}
        />
      </>
    )
  }

  return (
    <>
      <Box style={{ padding: '10px 10px 10px 0' }}>
        <FormControlLabel
          label="Show only lists created by me"
          control={
            <Checkbox
              onChange={checkboxHandleChange}
              className={`${styles.showOnlyListCheckbox}`}
            />
          }
        />
        <WishlistTable
          hiddenColumns={hiddenColumns}
          isLoading={isLoading}
          rows={rows || []}
          handleEditWishlist={handleEditToWishlist}
          handleCopyWishlist={handleCopyWishlist}
          handleDeleteWishlist={deleteWishlistEvent}
          pageCount={pageCount}
          setPage={(value) => setPage(value)}
        />
      </Box>
    </>
  )
}
export default Wishlist
