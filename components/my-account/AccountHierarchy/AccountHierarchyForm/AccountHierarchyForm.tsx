import { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Button, FormControl, Stack } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

import { AccountHierarchyFormStyles } from './AccountHierarchyForm.styles'
import { KiboTextBox } from '@/components/common'

import { CustomerAccount } from '@/lib/gql/types'

interface AccountHierarchyFormProps {
  user: CustomerAccount
  onSave: (data: any) => void
  onClose: () => void
}

const useAccountHierarchySchema = () => {
  const { t } = useTranslation('common')
  return yup.object({
    parentAccount: yup.string().required(t('this-field-is-required')),
    companyOrOrganization: yup.string().required(t('this-field-is-required')),
    firstName: yup.string().required(t('this-field-is-required')),
    lastName: yup.string().required(t('this-field-is-required')),
    emailAddress: yup.string().required(t('this-field-is-required')),
  })
}

const AccountHierarchyForm = (props: AccountHierarchyFormProps) => {
  const { user, onSave, onClose } = props

  const [isLoading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation()
  const accountHierarchySchema = useAccountHierarchySchema()

  const {
    formState: { errors, isValid },
    control,
    getValues,
    setValue,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    resolver: yupResolver(accountHierarchySchema),
    shouldFocusError: true,
  })

  useEffect(() => {
    if (user) {
      setValue('parentAccount', user?.companyOrOrganization)
    }
  }, [user])

  const onSubmit = async () => {
    if (isLoading || !isValid) return
    setLoading(true)
    const formValues = getValues()
    await onSave({
      ...formValues,
      parentAccount: user,
    })
    setLoading(false)
  }

  return (
    <form data-testid="account-hierarchy-form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl sx={{ width: '100%' }}>
        <Controller
          name="parentAccount"
          control={control}
          render={({ field }) => (
            <KiboTextBox
              value={field.value || ''}
              label={t('parent-account')}
              onChange={(_name, value) => field.onChange(value)}
              onBlur={field.onBlur}
              disabled
              error={!!errors?.parentAccount}
              helperText={errors?.parentAccount?.message as string}
            />
          )}
        />

        <Controller
          name="companyOrOrganization"
          control={control}
          render={({ field }) => (
            <KiboTextBox
              value={field.value || ''}
              label={t('company-name')}
              onChange={(_name, value) => field.onChange(value)}
              onBlur={field.onBlur}
              error={!!errors?.companyOrOrganization}
              helperText={errors?.companyOrOrganization?.message as string}
            />
          )}
        />

        <Controller
          name="taxId"
          control={control}
          render={({ field }) => (
            <KiboTextBox
              value={field.value || ''}
              label={`${t('tax-id')} (${t('optional')})`}
              onChange={(_name, value) => field.onChange(value)}
              onBlur={field.onBlur}
              error={!!errors?.taxId}
              helperText={errors?.taxId?.message as string}
            />
          )}
        />

        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <KiboTextBox
              value={field.value || ''}
              label={t('first-name')}
              onChange={(_name, value) => field.onChange(value)}
              onBlur={field.onBlur}
              error={!!errors?.firstName}
              helperText={errors?.firstName?.message as string}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <KiboTextBox
              value={field.value || ''}
              label={t('last-name-or-sur-name')}
              onChange={(_name, value) => field.onChange(value)}
              onBlur={field.onBlur}
              error={!!errors?.lastName}
              helperText={errors?.lastName?.message as string}
            />
          )}
        />

        <Controller
          name="emailAddress"
          control={control}
          render={({ field }) => (
            <KiboTextBox
              type="email"
              value={field.value || ''}
              label={t('email')}
              onChange={(_name, value) => field.onChange(value)}
              onBlur={field.onBlur}
              error={!!errors?.emailAddress}
              helperText={errors?.emailAddress?.message as string}
            />
          )}
        />

        <Stack gap={2} sx={{ ...AccountHierarchyFormStyles.buttonStackStyle }}>
          <Button
            data-testid="cancel-button"
            variant="contained"
            color="secondary"
            type="reset"
            onClick={onClose}
          >
            {t('cancel')}
          </Button>
          <LoadingButton
            data-testid="submit-button"
            variant="contained"
            color="primary"
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            {t('create-account')}
          </LoadingButton>
        </Stack>
      </FormControl>
    </form>
  )
}

export default AccountHierarchyForm
