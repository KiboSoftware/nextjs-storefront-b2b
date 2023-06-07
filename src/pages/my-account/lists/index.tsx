import { useState } from 'react'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Grid, Button, useMediaQuery, useTheme, IconButton, Container } from '@mui/material'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import CreateWishlist from '@/components/wishlist/CreateWishlist/createWishlist'
import Wishlist from '@/components/wishlist/wishlist'
import styles from '@/components/wishlist/wishlist.module.css'

import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

const ListsPage: NextPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [editForm, setEditForm] = useState(false)
  function openNewWishlistForm() {
    setOpenForm(true)
  }
  const router = useRouter()
  const theme = useTheme()
  const mdScreen = useMediaQuery<any>(theme.breakpoints.up('md'))
  const smScreen = useMediaQuery<any>(theme.breakpoints.up('sm'))

  if (!openForm) {
    return (
      <Container>
        <Grid container spacing={2} marginTop={2}>
          <Grid xs={12}>
            {editForm ? (
              <></>
            ) : (
              <div>
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
                    <span style={{ fontSize: '28px', marginRight: 'auto' }}> Lists </span>
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
                      <span style={{ marginLeft: 'auto', marginRight: 'auto' }}> Lists </span>
                    </>
                  )}
                </h1>
                <Button
                  onClick={openNewWishlistForm}
                  className={`${styles.addNewListButton}`}
                  startIcon={<AddCircleOutlineIcon />}
                  style={smScreen ? {} : { width: '100%' }}
                >
                  Create New List
                </Button>
              </div>
            )}
            <Wishlist handleEditForm={setEditForm} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  return (
    <Container>
      <Grid container spacing={2} marginTop={2}>
        <Grid xs={12}>
          <CreateWishlist handleCreateWishlist={setOpenForm} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default ListsPage