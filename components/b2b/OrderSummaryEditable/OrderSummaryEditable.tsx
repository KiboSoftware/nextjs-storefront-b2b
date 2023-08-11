import React, { useEffect } from 'react'

import ChevronRight from '@mui/icons-material/ChevronRight'
import ExpandMore from '@mui/icons-material/ExpandMore'
import {
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { OrderSummaryEditableStyles } from './OrderSummaryEditable.styles'
import { KiboRadio, KiboSelect, KiboTextBox, Price } from '@/components/common'

interface SummarySectionProps {
  title: string
  total: number
  subtotal: number
  adjustment: number
  taxTotal: number
  isEdit?: boolean
  adjustmentValue: number
  setAdjustmentValue: (val: number) => void
}

const AdjustmentType = {
  ADDED: 'Added to',
  SUBTRACTED: 'Subtracted from',
}
const SummarySection = (props: SummarySectionProps) => {
  const {
    title,
    total,
    subtotal,
    adjustment,
    taxTotal,
    isEdit,
    adjustmentValue,
    setAdjustmentValue,
  } = props
  const { t } = useTranslation('common')

  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }
  const adjustmentType = adjustment > 0 ? AdjustmentType.ADDED : AdjustmentType.SUBTRACTED

  const [selectValue, setSelectValue] = React.useState(adjustmentType)

  const selectOptions = [
    { label: `Add to ${title} Subtotal`, value: AdjustmentType.ADDED },
    { label: `Subtract from ${title} Subtotal`, value: AdjustmentType.SUBTRACTED },
  ]

  const [selectedRadio, setSelectedRadio] = React.useState('amount')

  const radioOptions = [
    {
      label: '$',
      value: 'amount',
      name: 'amount',
    },
    {
      label: '%',
      value: 'percentage',
      name: 'percentage',
    },
  ]

  const [adjustmentInputValue, setAdjustmentInputValue] = React.useState('')

  const handleAdjustmentInput = (val: string) => {
    if (!val || !new RegExp(/^(?:\d+(\.\d*)?|\.\d+)$/).test(val)) {
      !val && setAdjustmentInputValue(val)
      return
    }

    const value = parseFloat(val)

    if (selectedRadio === 'amount') {
      setAdjustmentValue(selectValue === AdjustmentType.ADDED ? value : -value)
    } else {
      const amount = (subtotal * value) / 100
      setAdjustmentValue(selectValue === AdjustmentType.ADDED ? amount : -amount)
    }

    setAdjustmentInputValue(value.toString())
  }

  const handleAdjustmentTypeChange = (value: string) => {
    setSelectValue(value)
    setAdjustmentValue(adjustment)
    handleAdjustmentInput('')
  }

  useEffect(() => {
    isEdit && setOpen(isEdit)
  }, [isEdit])

  useEffect(() => {
    handleAdjustmentInput(adjustmentInputValue)
  }, [selectedRadio])

  return (
    <>
      <ListItemButton sx={{ paddingInline: 0 }}>
        <ListItem
          sx={{ padding: 0 }}
          onClick={handleClick}
          secondaryAction={
            <Price
              fontWeight="normal"
              variant="body2"
              price={t('currency', { val: total?.toString() })}
            />
          }
        >
          <ListItemIcon sx={{ minWidth: 30 }}>
            {open ? <ExpandMore /> : <ChevronRight />}
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body2">{t('titleTotal', { title })}</Typography>}
          />
        </ListItem>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            slotProps={{
              root: {
                'aria-label': 'subtotal',
              },
            }}
            sx={OrderSummaryEditableStyles.detailedSummaryContainer}
            secondaryAction={
              <Price
                fontWeight="normal"
                variant="body2"
                price={t('currency', { val: subtotal?.toString() })}
              />
            }
          >
            <ListItemText
              primary={<Typography variant="body2">{t('titleSubtotal', { title })}</Typography>}
            />
          </ListItem>

          {isEdit ? (
            <ListItem
              sx={{
                ...OrderSummaryEditableStyles.adjustMentEditContainer,
                flexDirection: {
                  xs: isEdit ? 'column' : 'row',
                  md: 'row',
                },
              }}
            >
              <ListItemText
                sx={{ width: '100%' }}
                primary={
                  <Box>
                    <KiboSelect
                      name={'adjustment'}
                      value={selectValue}
                      onChange={(_, value) => {
                        handleAdjustmentTypeChange(value)
                      }}
                    >
                      {selectOptions?.map((option: any) => (
                        <MenuItem
                          sx={{ typography: 'body2' }}
                          key={option?.value}
                          value={option?.value}
                        >
                          {option?.label}
                        </MenuItem>
                      ))}
                    </KiboSelect>
                  </Box>
                }
              />

              <Box
                display="flex"
                alignItems={'center'}
                justifyContent="flex-end"
                gap={2}
                sx={{ ml: { md: 'auto' } }}
                width="100%"
              >
                <Box>
                  <KiboRadio
                    name="adjustment-type"
                    radioOptions={radioOptions}
                    row
                    selected={selectedRadio}
                    onChange={setSelectedRadio}
                  />
                </Box>
                <Box maxWidth={50}>
                  <KiboTextBox
                    name="adjustment-input"
                    value={adjustmentInputValue}
                    onChange={(_, value) => handleAdjustmentInput(value)}
                  />
                </Box>
              </Box>
            </ListItem>
          ) : null}

          <ListItem
            slotProps={{
              root: {
                'aria-label': 'adjustment',
              },
            }}
            sx={OrderSummaryEditableStyles.detailedSummaryContainer}
            secondaryAction={
              <Price
                fontWeight="normal"
                variant="body2"
                price={t('currency', { val: adjustmentValue?.toString() })}
              />
            }
          >
            <ListItemText
              primary={
                <Typography variant="body2">
                  {t('adjustment-text', { selectValue, title })}
                </Typography>
              }
            />
          </ListItem>

          <ListItem
            slotProps={{
              root: {
                'aria-label': 'tax',
              },
            }}
            sx={OrderSummaryEditableStyles.detailedSummaryContainer}
            secondaryAction={
              <Price
                fontWeight="normal"
                variant="body2"
                price={t('currency', { val: taxTotal?.toString() })}
              />
            }
          >
            <ListItemText
              primary={<Typography variant="body2">{t('titleTax', { title })}</Typography>}
            />
          </ListItem>
        </List>
      </Collapse>
    </>
  )
}

interface OrderSummaryEditableProps {
  itemTotal: number
  itemTaxTotal: number
  subTotal: number
  adjustment: number

  shippingTotal: number
  shippingTaxTotal: number
  shippingSubTotal: number
  shippingAdjustment: number

  handlingTotal: number
  handlingTaxTotal: number
  handlingSubTotal: number
  handlingAdjustment: number

  dutyTotal: number

  // use Type QuoteAdjustmentInput once in production
  onSave: (param: {
    adjustment: number
    shippingAdjustment: number
    handlingAdjustment: number
  }) => void
}

const OrderSummaryEditable = (props: OrderSummaryEditableProps) => {
  const {
    itemTotal,
    subTotal,
    itemTaxTotal,
    adjustment,

    shippingTotal,
    shippingSubTotal,
    shippingAdjustment,
    shippingTaxTotal,

    handlingTotal,
    handlingSubTotal,
    handlingAdjustment,
    handlingTaxTotal,

    dutyTotal,
    onSave,
  } = props
  const { t } = useTranslation('common')

  const [adjustmentValue, setAdjustmentValue] = React.useState({
    adjustment: adjustment,
    shippingAdjustment: shippingAdjustment,
    handlingAdjustment: handlingAdjustment,
  })

  const [isEdit, setIsEdit] = React.useState(false)

  const handleEditButtonClick = () => {
    setIsEdit(!isEdit)
  }

  const handleSave = () => {
    onSave(adjustmentValue)
    handleEditButtonClick()
  }

  const handleAdjustmentValue = (value: number, type: string) => {
    setAdjustmentValue((prev) => ({ ...prev, [type]: value }))
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 860 }}
      component="nav"
      aria-labelledby="order-summary-editable"
    >
      <ListItem
        disableGutters
        secondaryAction={
          <Box display="flex" gap={2}>
            {isEdit ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={handleEditButtonClick}
                >
                  {t('cancel')}
                </Button>
                <Button variant="contained" color="primary" size="small" onClick={handleSave}>
                  {t('save')}
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={handleEditButtonClick}
              >
                {t('edit')}
              </Button>
            )}
          </Box>
        }
      >
        <ListItemText
          primary={
            <Typography variant="subtitle1" fontWeight={'bold'}>
              {t('summary')}
            </Typography>
          }
        />
      </ListItem>
      <SummarySection
        title="Item"
        total={itemTotal}
        subtotal={subTotal}
        adjustment={adjustment}
        taxTotal={itemTaxTotal}
        isEdit={isEdit}
        adjustmentValue={adjustmentValue.adjustment}
        setAdjustmentValue={(val) => handleAdjustmentValue(val, 'adjustment')}
      />
      <SummarySection
        title="Shipping"
        total={shippingTotal}
        subtotal={shippingSubTotal}
        adjustment={shippingAdjustment}
        taxTotal={shippingTaxTotal}
        isEdit={isEdit}
        adjustmentValue={adjustmentValue.shippingAdjustment}
        setAdjustmentValue={(val) => handleAdjustmentValue(val, 'shippingAdjustment')}
      />
      <SummarySection
        title="Handling"
        total={handlingTotal}
        subtotal={handlingSubTotal}
        adjustment={handlingAdjustment}
        taxTotal={handlingTaxTotal}
        isEdit={isEdit}
        adjustmentValue={adjustmentValue.handlingAdjustment}
        setAdjustmentValue={(val) => handleAdjustmentValue(val, 'handlingAdjustment')}
      />
      <ListItem
        slotProps={{
          root: {
            'aria-label': 'duty-total',
          },
        }}
        sx={{ paddingLeft: 0 }}
        secondaryAction={
          <Price
            fontWeight="normal"
            variant="body2"
            price={t('currency', { val: dutyTotal?.toString() })}
          />
        }
      >
        <ListItemIcon sx={{ minWidth: 30 }} />
        <ListItemText primary={<Typography variant="body2">{t('duty-total')}</Typography>} />
      </ListItem>
    </List>
  )
}

export default OrderSummaryEditable
