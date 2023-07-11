import React, { useState } from 'react'

import { Box, InputLabel } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { matchSorter } from 'match-sorter'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'

import { b2bProductSearchStyle } from './B2BProductSearch.style'
import { ProductItem } from '@/components/common'
import { useDebounce, useGetSearchedProducts } from '@/hooks'
import { productGetters } from '@/lib/getters'

import { CrProduct } from '@/lib/gql/types'

export interface B2BProductSearchProps {
  onAddProduct: (params?: CrProduct) => void
}

const B2BProductSearch = (props: B2BProductSearchProps) => {
  const { t } = useTranslation('common')
  const { onAddProduct } = props
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
    onAddProduct(value)
    setValue('')
  }

  const { data: productSearchResult, isLoading } = useGetSearchedProducts({
    search: useDebounce(value, publicRuntimeConfig.debounceTimeout),
    pageSize: 16,
  })

  const filterOptions = (options: any, { inputValue }: { inputValue: any }) =>
    matchSorter(options, inputValue, {
      keys: [
        { threshold: matchSorter.rankings.CONTAINS, key: 'content.productName' },
        'productCode',
      ],
    })

  const b2bProductSearchResult = productSearchResult?.items || ([] as any)

  return (
    <Autocomplete
      selectOnFocus
      freeSolo
      sx={{
        ...b2bProductSearchStyle.searchBox,
      }}
      options={b2bProductSearchResult}
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
      filterOptions={filterOptions}
    />
  )
}

export default B2BProductSearch
