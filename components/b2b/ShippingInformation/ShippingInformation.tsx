import React, { useState } from 'react'

import { Box, Button, Checkbox, FormControlLabel, Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { ShippingMethod } from '@/components/checkout'
import { AddressCard, AddressForm, KiboRadio } from '@/components/common'
import { useAuthContext } from '@/context'
import { userGetters } from '@/lib/getters'

import { CrContact, CrOrderItem, CrShippingRate, CustomerContact } from '@/lib/gql/types'
interface ShippingInformationProps {
  savedShippingAddresses: CustomerContact[]
  selectedShippingAddressId: string
  shippingMethods: CrShippingRate[]
  selectedShippingMethodCode: string
  shipItems: CrOrderItem[]
  pickupItems: CrOrderItem[]
  handleAddressSelect: (addressId: string) => void
  onSaveAddressToCheckout: ({ contact }: { contact: CrContact }) => Promise<void>
  handleSaveShippingMethod?: (shippingMethodCode: string) => void
}
const ShippingInformation = (props: ShippingInformationProps) => {
  const {
    savedShippingAddresses,
    selectedShippingAddressId,
    shippingMethods,
    shipItems,
    pickupItems,
    selectedShippingMethodCode,
    handleAddressSelect,
    onSaveAddressToCheckout,
    handleSaveShippingMethod,
  } = props
  const { t } = useTranslation('common')
  // Your component logic here
  const [validateForm, setValidateForm] = useState<boolean>(false)
  const [isNewAddressAdded, setIsNewAddressAdded] = useState<boolean>(false)
  const [isAddressFormValid, setIsAddressFormValid] = useState<boolean>(false)
  const [isAddressSavedToAccount, setIsAddressSavedToAccount] = useState<boolean>(false)
  const { isAuthenticated } = useAuthContext()
  const showPreviouslySavedAddress = savedShippingAddresses?.length
  const [shouldShowAddAddressButton, setShouldShowAddAddressButton] = useState<boolean>(
    Boolean(savedShippingAddresses?.length)
  )
  const defaultShippingAddress = userGetters.getDefaultShippingAddress(
    savedShippingAddresses as CustomerContact[]
  )
  const previouslySavedShippingAddress = userGetters.getOtherShippingAddress(
    savedShippingAddresses as CustomerContact[],
    defaultShippingAddress?.id as number
  )
  const handleAddNewAddress = () => {
    setValidateForm(false)
    setIsNewAddressAdded(false)
    setShouldShowAddAddressButton(false)
  }
  //   const handleSaveAddressToCheckout = async ({ contact }: { contact: CrContact }) => {
  //     const response = await onSaveAddressToCheckout({ contact })
  //     setValidateForm(false)
  //     if (response) {
  //       setShouldShowAddAddressButton(true)
  //       setIsNewAddressAdded(true)
  //     }
  //   }
  const handleFormStatusChange = (status: boolean) => setIsAddressFormValid(status)
  const handleAddressValidationAndSave = () => setValidateForm(true)
  return (
    <>
      {shouldShowAddAddressButton && (
        <>
          <Stack gap={2} width="100%">
            {defaultShippingAddress && (
              <>
                <Typography variant="h4" fontWeight={'bold'}>
                  {t('your-default-shipping-address')}
                </Typography>
                <KiboRadio
                  radioOptions={[
                    {
                      value: String(defaultShippingAddress.id),
                      name: String(defaultShippingAddress.id),
                      optionIndicator: t('primary'),
                      label: (
                        <AddressCard
                          firstName={defaultShippingAddress?.firstName as string}
                          middleNameOrInitial={
                            defaultShippingAddress?.middleNameOrInitial as string
                          }
                          lastNameOrSurname={defaultShippingAddress?.lastNameOrSurname as string}
                          address1={defaultShippingAddress?.address?.address1 as string}
                          address2={defaultShippingAddress?.address?.address2 as string}
                          cityOrTown={defaultShippingAddress?.address?.cityOrTown as string}
                          stateOrProvince={
                            defaultShippingAddress?.address?.stateOrProvince as string
                          }
                          postalOrZipCode={
                            defaultShippingAddress?.address?.postalOrZipCode as string
                          }
                        />
                      ),
                    },
                  ]}
                  selected={selectedShippingAddressId?.toString()}
                  align="flex-start"
                  onChange={handleAddressSelect}
                />
              </>
            )}
            {showPreviouslySavedAddress && (
              <>
                <Typography variant="h4" fontWeight={'bold'}>
                  {t('previously-saved-shipping-addresses')}
                </Typography>
                <KiboRadio
                  radioOptions={previouslySavedShippingAddress?.map((address, index) => {
                    return {
                      value: String(address.id),
                      name: String(address.id),
                      label: (
                        <AddressCard
                          firstName={address?.firstName as string}
                          middleNameOrInitial={address?.middleNameOrInitial as string}
                          lastNameOrSurname={address?.lastNameOrSurname as string}
                          address1={address?.address?.address1 as string}
                          address2={address?.address?.address2 as string}
                          cityOrTown={address?.address?.cityOrTown as string}
                          stateOrProvince={address?.address?.stateOrProvince as string}
                          postalOrZipCode={address?.address?.postalOrZipCode as string}
                        />
                      ),
                    }
                  })}
                  selected={selectedShippingAddressId?.toString()}
                  align="flex-start"
                  onChange={handleAddressSelect}
                />
              </>
            )}
            <Button
              variant="contained"
              color="inherit"
              sx={{ width: { xs: '100%', sm: '50%' } }}
              onClick={handleAddNewAddress}
            >
              {t('add-new-address')}
            </Button>
          </Stack>
          {shippingMethods.length > 0 && (
            <ShippingMethod
              shipItems={shipItems}
              pickupItems={pickupItems}
              orderShipmentMethods={[...shippingMethods]}
              selectedShippingMethodCode={selectedShippingMethodCode}
              onShippingMethodChange={handleSaveShippingMethod}
              // onStoreLocatorClick={handleStoreLocatorClick}
            />
          )}
        </>
      )}
      {!shouldShowAddAddressButton && (
        <>
          <AddressForm
            isUserLoggedIn={false}
            saveAddressLabel={t('save-shipping-address')}
            setAutoFocus={true}
            validateForm={validateForm}
            onSaveAddress={onSaveAddressToCheckout}
            onFormStatusChange={handleFormStatusChange}
          />
          {isAuthenticated && (
            <FormControlLabel
              label={t('save-address-to-account')}
              control={
                <Checkbox
                  sx={{ marginLeft: '0.5rem' }}
                  inputProps={{
                    'aria-label': t('save-address-to-account'),
                  }}
                  onChange={() => setIsAddressSavedToAccount(!isAddressSavedToAccount)}
                />
              }
            />
          )}
          <Box m={1} maxWidth={'872px'} data-testid="address-form">
            <Grid container>
              <Grid item xs={6} gap={2} display={'flex'} direction={'column'}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setShouldShowAddAddressButton(true)}
                >
                  {t('cancel')}
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  style={{ textTransform: 'none' }}
                  onClick={handleAddressValidationAndSave}
                  {...(!isAddressFormValid && { disabled: true })}
                >
                  {t('save-shipping-address')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  )
}
export default ShippingInformation
