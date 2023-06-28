import { useState } from 'react'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Grid, Button, useMediaQuery, useTheme, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// import { ReactQueryDevtools } from 'react-query/devtools'

// import CreateWishlist from '@/components/wishlist/CreateWishlist/createWishlist'
// import Wishlist from '@/components/wishlist/wishlist'

import Lists from '@/components/my-account/Lists/Lists'

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

const addNewListButtonStyles = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 16px',
  gap: '8px',
  height: '37px',
  backgroundColor: '#2b2b2b',
  borderRadius: '4px',
  color: '#ffffff',
  fontWeight: '400',
  fontSize: '18px',
  marginBottom: '24px',
  marginTop: '32px',
  '&:hover': {
    color: '#fff',
    backgroundColor: '#2b2b2b',
  },
}

const ListsPage: NextPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [editForm, setEditForm] = useState(false)
  const router = useRouter()
  const theme = useTheme()
  const mdScreen = useMediaQuery<boolean>(theme.breakpoints.up('md'))
  const smScreen = useMediaQuery<boolean>(theme.breakpoints.up('sm'))

  if (!openForm) {
    return (
      <Grid spacing={2} marginTop={2}>
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
                onClick={() => setOpenForm(true)}
                sx={addNewListButtonStyles}
                startIcon={<AddCircleOutlineIcon />}
                style={smScreen ? {} : { width: '100%' }}
              >
                Create New List
              </Button>
            </div>
          )}
          <Lists handleEditForm={setEditForm} />
        </Grid>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </Grid>
    )
  }

  return (
    <Grid spacing={2} marginTop={2}>
      <Grid xs={12}>
        {/* <CreateWishlist handleCreateWishlist={setOpenForm} /> */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <h1>Work In Progress</h1>
      </Grid>
    </Grid>
  )
}

export default ListsPage
