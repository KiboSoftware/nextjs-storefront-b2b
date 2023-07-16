import React, { useEffect, useState } from 'react'

import {
  Box,
  CircularProgress,
  Collapse,
  Fade,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Popover,
  Popper,
  Stack,
  Typography,
} from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'

import { b2bProductSearchStyle } from './B2BProductSearch.style'
import { KiboTextBox, ProductItem } from '@/components/common'
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

  const handleSearch = (_: string, userEnteredValue: string) => setSearchTerm(userEnteredValue)

  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false)

  const handlePopperOpen = () => setIsPopperOpen(true)
  const handlePopperClose = () => setIsPopperOpen(false)

  const { data: productSearchResult, isLoading } = useGetSearchedProducts({
    search: useDebounce(searchTerm, publicRuntimeConfig.debounceTimeout),
    pageSize: 16,
  })

  const b2bProductSearchResult = productSearchResult?.items || ([] as any)

  useEffect(() => {
    searchTerm.trim() ? handlePopperOpen() : handlePopperClose()
  }, [searchTerm])

  const handleChange = async (event: any, value: any) => {
    if (value) {
      onAddProduct(value)
    }
    setSearchTerm('')
  }

  return (
    <Stack sx={{ position: 'relative' }}>
      <KiboTextBox
        label={t('search-for-product')}
        value={searchTerm}
        placeholder={t('search-by-name-or-code')}
        autocomplete="off"
        onChange={handleSearch}
      />
      <Collapse in={isPopperOpen} timeout="auto" unmountOnExit role="contentinfo">
        <Paper
          elevation={3}
          sx={(theme) => ({
            borderRadius: 0,
            position: 'absolute',
            top: '80%',
            zIndex: theme.zIndex.modal,
            width: '100%',
          })}
        >
          {isLoading && (
            <Box width="100%" display={'flex'} justifyContent={'center'} p={2}>
              <CircularProgress size={20} />
            </Box>
          )}
          {!isLoading && !b2bProductSearchResult.length ? (
            <Box width="100%" display={'flex'} justifyContent={'center'} pt={2}>
              <Typography>{t('no-products-found')}</Typography>
            </Box>
          ) : null}
          {!isLoading && (
            <List sx={{ cursor: 'pointer', maxHeight: '30vh', overflowY: 'auto' }}>
              {b2bProductSearchResult.map((option: any) => {
                return (
                  <ListItemButton
                    key={productGetters.getProductId(option as CrProduct)}
                    onClick={(evt) => handleChange(evt, option)}
                  >
                    <ProductItem
                      image={
                        productGetters.getCoverImage(option) &&
                        productGetters.handleProtocolRelativeUrl(
                          productGetters.getCoverImage(option)
                        )
                      }
                      name={productGetters.getName(option as CrProduct)}
                      productCode={productGetters.getProductId(option as CrProduct)}
                      isQuickOrder={true}
                    />
                  </ListItemButton>
                )
              })}
            </List>
          )}
        </Paper>
      </Collapse>
    </Stack>
  )
}

export default B2BProductSearch
