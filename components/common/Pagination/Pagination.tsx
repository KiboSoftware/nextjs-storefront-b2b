import React from 'react'

import { Pagination, createTheme, ThemeProvider, SxProps, Theme, useTheme } from '@mui/material'
import { Container } from '@mui/system'

interface PaginationProps {
  count?: number
  onChange: any
  size?: 'small' | 'medium' | 'large'
  sx?: SxProps<Theme>
}

export default function PaginationCustom(props: PaginationProps) {
  const { count, size, sx } = props
  const theme = useTheme()
  function handleChange(e: any, value: any) {
    props.onChange(value)
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Pagination
          count={count}
          shape={`rounded`}
          color="primary"
          onChange={handleChange}
          size={size}
          sx={{ ...sx }}
          variant="text"
        />
      </ThemeProvider>
    </>
  )
}
