import React, { useEffect, useState } from 'react'

import {
  Box,
  Collapse,
  Fade,
  InputLabel,
  List,
  ListItem,
  Paper,
  Popover,
  Popper,
  Stack,
  Typography,
} from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { matchSorter } from 'match-sorter'
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'

import { b2bProductSearchStyle } from './B2BProductSearch.style'
import { KiboTextBox, ProductItem, SearchBar } from '@/components/common'
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

  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSearch = (userEnteredValue: string) => setSearchTerm(userEnteredValue)

  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false)

  const handlePopperOpen = () => setIsPopperOpen(true)
  const handlePopperClose = () => setIsPopperOpen(false)

  useEffect(() => {
    searchTerm.trim() ? handlePopperOpen() : handlePopperClose()
  }, [searchTerm])

  const handleChange = async (event: any, value: any) => {
    if (value) {
      onAddProduct(value)
    }
    setSearchTerm('')
  }

  const { data: productSearchResult, isLoading } = useGetSearchedProducts({
    search: useDebounce(searchTerm, publicRuntimeConfig.debounceTimeout),
    pageSize: 16,
  })

  const b2bProductSearchResult = productSearchResult?.items || ([] as any)

  return (
    // <Autocomplete
    //   selectOnFocus
    //   freeSolo
    //   sx={{
    //     ...b2bProductSearchStyle.searchBox,
    //   }}
    //   options={b2bProductSearchResult}
    //   getOptionLabel={(option) => productGetters.getName(option as CrProduct)}
    //   renderInput={(params) => (
    //     <Box>
    //       <InputLabel shrink htmlFor="kibo-input">
    //         {t('search-for-product')}
    //       </InputLabel>
    //       <TextField {...params} placeholder={t('search-by-name-or-code')} />
    //     </Box>
    //   )}
    //   renderOption={renderOption}
    //   onInputChange={handleInputChange}
    //   onChange={handleChange}
    //   filterOptions={filterOptions}
    // />
    <Stack>
      <Box sx={{ zIndex: 1400 }}>
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} showClearButton />
      </Box>
      <Collapse
        in={isPopperOpen}
        timeout="auto"
        unmountOnExit
        role="contentinfo"
        sx={{ zIndex: 1400 }}
      >
        <Paper
          elevation={3}
          sx={{ mt: 1, borderRadius: 0, position: 'relative', zIndex: 1400, width: '100%' }}
        >
          <List>
            {b2bProductSearchResult.map((option: any) => {
              return (
                <ListItem
                  {...props}
                  key={productGetters.getProductId(option as CrProduct)}
                  onClick={(evt) => handleChange(evt, option)}
                >
                  <ProductItem
                    image={
                      productGetters.getCoverImage(option) &&
                      productGetters.handleProtocolRelativeUrl(productGetters.getCoverImage(option))
                    }
                    name={productGetters.getName(option as CrProduct)}
                    productCode={productGetters.getProductId(option as CrProduct)}
                    isQuickOrder={true}
                  />
                </ListItem>
              )
            })}
          </List>
        </Paper>
      </Collapse>
    </Stack>
  )
}

export default B2BProductSearch
