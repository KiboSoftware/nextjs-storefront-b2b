import { Button, Grid, Pagination, createTheme, ThemeProvider } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'

interface PaginationProps {
  pageCount: number
  onChange: any
}

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#2B2B2B',
    },
  },
})

export default function PaginationCustom(props: PaginationProps) {
  const { pageCount } = props

  function handleChange(e: any, value: any) {
    props.onChange(value)
  }

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <Container style={{ margin: '20px 0' }}>
          <Pagination count={pageCount} shape={`rounded`} color="primary" onChange={handleChange} />
        </Container>
      </ThemeProvider>
    </>
  )
}
