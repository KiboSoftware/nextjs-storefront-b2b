import React, { useState } from 'react'

import { Box, InputLabel } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'

import { ProductItem } from '@/components/common'
import { useDebounce, useGetSearchedProducts } from '@/hooks'
import { productGetters } from '@/lib/getters'

import { CrProduct } from '@/lib/gql/types'

const QuickOrderProductSearch = (props: any) => {
  const { t } = useTranslation('common')
  const { publicRuntimeConfig } = getConfig()
  const [value, setValue] = useState('')
  const renderOption = (props: any, option: any) => {
    if (isLoading) return null
    return (
      <li {...props} key={productGetters.getProductId(option as CrProduct)}>
        <ProductItem
          image={
            productGetters.getCoverImage(option) &&
            productGetters.handleProtocolRelativeUrl(productGetters.getCoverImage(option))
          }
          name={productGetters.getName(option as CrProduct)}
          productCode={productGetters.getProductId(option as CrProduct)}
          isQuickOrder={true}
        />
      </li>
    )
  }
  const handleInputChange = async (event: any, value: any) => {
    setValue(value)
  }

  const handleChange = async (event: any, value: any) => {
    console.log('handle change value', value)
  }

  const { data: productSearchResult, isLoading } = useGetSearchedProducts({
    search: useDebounce(value, publicRuntimeConfig.debounceTimeout),
    pageSize: 16,
  })

  const quickOrderProductSearchResult = productSearchResult?.items || []
  return (
    <Autocomplete
      freeSolo
      sx={{
        '& .MuiOutlinedInput-root': {
          padding: 0,
        },
        '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
          padding: '5px',
        },
        width: { md: '445px' },
      }}
      options={quickOrderProductSearchResult}
      getOptionLabel={(option) => productGetters.getName(option as CrProduct)}
      renderInput={(params) => (
        <Box>
          <InputLabel shrink htmlFor="kibo-input">
            {t('search-for-product')}
          </InputLabel>
          <TextField {...params} placeholder={t('search-by-name-or-code')} />
        </Box>
      )}
      renderOption={renderOption}
      onInputChange={handleInputChange}
      onChange={handleChange}
    />
  )
}

export default QuickOrderProductSearch
