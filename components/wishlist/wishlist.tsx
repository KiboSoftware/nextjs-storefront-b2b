import { useEffect, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FolderCopySharpIcon from '@mui/icons-material/FolderCopySharp'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Container,
  FormControlLabel,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Checkbox,
  useMediaQuery,
  Menu,
  MenuItem,
} from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

import EditWishlist from './editWishlist'
import styles from './wishlist.module.css'
import { KiboDialog } from '../common'
import Pagination from '../common/Pagination/Pagination'
import { useAuthContext } from '@/context'
import { useAllWishlistsQueries, useCreateWishlistMutation } from '@/hooks'
import { useDeleteWishlistMutation } from '@/hooks/mutations/useWishlistMutations/useDeleteWishlistMutation/useDeleteWishlistMutation'
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F7F7F7',
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({}))

const ListMenu = (props: any) => {
  const options = ['Edit', 'Add list items to cart', 'Initiate Quote', 'Duplicate', 'Delete']
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenMenu = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  function handleOptionClick(e: any) {
    console.log('checking', 0 === e.currentTarget.value)
    switch (e.currentTarget.value) {
      case 0:
        props.editWishlist(e)
        handleCloseMenu()
        break
      case 1:
        props.addAllToCart(e)
        handleCloseMenu()
        break
      case 2:
        props.initiateQuote(e)
        handleCloseMenu()
        break
      case 3:
        props.copyWishlist(e)
        handleCloseMenu()
        break
      case 4:
        props.deleteWishlist(e)
        handleCloseMenu()
        break
      default:
        console.log('default')
    }
  }

  return (
    <div style={{ display: 'inline' }}>
      <IconButton onClick={handleOpenMenu} id={props.id}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {options.map((o, i) => (
          <MenuItem
            key={i}
            value={i}
            id={props.id}
            onClick={handleOptionClick}
            style={i !== options.length - 1 ? { borderBottom: '0.5px solid #EAEAEA' } : {}}
          >
            {o}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

const Wishlist = (props: any) => {
  const { user } = useAuthContext()
  const { createCustomWishlist } = useCreateWishlistMutation()
  const { deleteWishlist } = useDeleteWishlistMutation()
  const theme = useTheme()
  const mdScreen = useMediaQuery<any>(theme.breakpoints.up('md'))
  const smScreen = useMediaQuery<any>(theme.breakpoints.up('sm'))
  const xsScreen = useMediaQuery<any>(theme.breakpoints.up('xs'))
  const [wishlistData, setWishlistData] = useState()
  const [listFilter, setListFilter] = useState('')
  const [page, setPage] = useState(1)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deletedWishlistId, setDeletedWishlistId] = useState(0)
  const pageSize = 5
  const [startIndex, setStartIndex] = useState(0)
  const userID = user?.userId

  const [editList, setEditList] = useState(false)
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  useEffect(() => {
    setStartIndex(pageSize * (page - 1))
  }, [page, listFilter])

  function checkboxHandleChange(e: any) {
    if (e.target.checked) {
      const filter = 'createBy eq ' + userID
      setListFilter(filter)
    } else {
      setListFilter('')
    }
  }

  const { data, refetch } = useAllWishlistsQueries({
    pageSize,
    startIndex,
    sortBy: 'createDate desc',
    filter: listFilter,
  })

  const totalCount = data?.totalCount
  const pageCount = parseInt((totalCount / pageSize + 1).toString())

  const listData = data?.items

  function handleEditToWishlist(e: any) {
    const wishlist: any = listData?.find((item: any) => item.id === e.currentTarget.id)
    setWishlistData(wishlist)
    setEditList(true)
    props.handleEditForm(true)
  }
  function getDate(date: any) {
    const d = new Date(date)
    const dateString = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    return dateString
  }

  function handleCopyWishlist(e: any) {
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
  function deleteWishlistEvent(e: any) {
    setOpenDeleteModal(true)
    const wishlistId = e.currentTarget.id
    setDeletedWishlistId(wishlistId)
  }
  async function onDeleteWishlist() {
    const response = await deleteWishlist.mutateAsync(deletedWishlistId)
    if (response?.deleteWishlist) {
      console.log('Wishlist Deleted')
      setOpenDeleteModal(false)
    } else {
      console.log('error occured')
    }
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
      <Container style={{ padding: '10px 10px 10px 0' }}>
        <div>
          <FormControlLabel
            label="Show only lists created by me"
            control={
              <Checkbox
                onChange={checkboxHandleChange}
                className={`${styles.showOnlyListCheckbox}`}
              />
            }
          />
        </div>
        <TableContainer
          component={Paper}
          className={styles.tableContainer}
          style={!mdScreen ? { overflowX: 'hidden' } : {}}
        >
          <Table sx={{ minWidth: 700 }} style={{ tableLayout: 'fixed' }} aria-label="Quotes table">
            <TableHead className={styles.tableHead}>
              <TableRow>
                <StyledTableCell
                  className={styles.tableHeadCell}
                  style={!smScreen ? { width: '150px' } : {}}
                >
                  List name
                </StyledTableCell>
                <StyledTableCell className={styles.tableHeadCell}>Date created</StyledTableCell>
                {!mdScreen ? null : (
                  <StyledTableCell className={styles.tableHeadCell}>Created by</StyledTableCell>
                )}
                {mdScreen ? <StyledTableCell></StyledTableCell> : null}

                {/* <StyledTableCell align="center">Created Date</StyledTableCell>
                                <StyledTableCell align="center">Total</StyledTableCell>
                                <StyledTableCell align="center">Status</StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {listData?.map((e: any, i: any) => (
                <StyledTableRow key={e.id} className={styles.tableRow}>
                  <StyledTableCell className={styles.tableBodyCell}>
                    <p style={{ textAlign: 'left', padding: 0, display: 'inline-block' }}>
                      {e.name || 'N/A'}
                    </p>
                  </StyledTableCell>
                  <StyledTableCell className={styles.tableBodyCell}>
                    {getDate(e.auditInfo?.createDate) || 'N/A'}
                    {!mdScreen ? (
                      <ListMenu
                        id={e.id}
                        editWishlist={handleEditToWishlist}
                        deleteWishlist={deleteWishlistEvent}
                        copyWishlist={handleCopyWishlist}
                        initiateQuote={() => console.log('Work in Progress')}
                        addAllToCart={() => console.log('Work in Progress')}
                      />
                    ) : null}
                  </StyledTableCell>
                  {!mdScreen ? null : (
                    <StyledTableCell className={styles.tableBodyCell}>
                      {getDate(e.auditInfo?.updateDate) || 'N/A'}
                    </StyledTableCell>
                  )}
                  {!mdScreen ? (
                    <></>
                  ) : (
                    <>
                      <StyledTableCell className={styles.wishlistTableAction}>
                        <div className="table-actions">
                          <IconButton id={e.id} className={`${styles.iconTextButton}`}>
                            Initiate Quote
                          </IconButton>
                        </div>
                        <div className="table-actions">
                          <IconButton id={e.id} className={`${styles.iconTextButton}`}>
                            Add to Cart
                          </IconButton>
                        </div>
                        <div className="table-actions">
                          <IconButton
                            id={e.id}
                            className={`${styles.iconTextButton} edit-wishlist-btn`}
                            onClick={handleEditToWishlist}
                          >
                            <EditIcon />
                          </IconButton>
                        </div>
                        <div className="table-actions">
                          <IconButton
                            id={e.id}
                            className={`${styles.iconTextButton} copy-wishlist-btn`}
                            onClick={handleCopyWishlist}
                          >
                            <FolderCopySharpIcon />
                          </IconButton>
                        </div>
                        <div className="table-actions">
                          <IconButton
                            id={e.id}
                            className={`${styles.iconTextButton} delete-wishlist-btn`}
                            onClick={deleteWishlistEvent}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </StyledTableCell>
                    </>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={pageCount} onChange={setPage} />
      </Container>
      <KiboDialog
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        Content={
          <>
            <div>
              <p>Are you sure you want to delete the list?</p>
            </div>
          </>
        }
        Actions={
          <>
            <Button onClick={() => setOpenDeleteModal(false)}> Cancel </Button>
            <Button onClick={() => onDeleteWishlist()}> Delete </Button>
          </>
        }
        Title={null}
        customMaxWidth="80%"
      />
    </>
  )
}
export default Wishlist
