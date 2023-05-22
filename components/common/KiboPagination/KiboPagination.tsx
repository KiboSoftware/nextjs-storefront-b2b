import React, { ChangeEvent } from 'react'

import { Pagination, SxProps, Theme } from '@mui/material'
import { Container } from '@mui/system'

interface KiboPaginationProps {
  count?: number
  onChange: any
  size: 'small' | 'medium' | 'large'
  sx?: SxProps<Theme>
}

const KiboPagination = (props: KiboPaginationProps) => {
  const { count, size, sx, onChange } = props

  function handleChange(event: ChangeEvent<any>, page: number) {
    onChange(page)
  }

  return (
    <Container style={{ margin: '20px 0' }}>
      <Pagination
        count={count}
        shape={`rounded`}
        onChange={handleChange}
        size={size}
        sx={{ ...sx }}
      />
    </Container>
  )
}

export default KiboPagination
