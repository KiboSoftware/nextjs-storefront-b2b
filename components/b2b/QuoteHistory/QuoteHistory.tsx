import React from 'react'

import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { quoteGetters } from '@/lib/getters'

import { AuditRecord } from '@/lib/gql/types'

interface QuoteHistoryProps {
  // Define your props here
  auditHistory: AuditRecord[]
}

const QuoteHistoryItem = ({ record }: { record: AuditRecord }) => {
  const { recordType, getRecordCreatedBy, getRecordUpdateDate, changedFields } =
    quoteGetters.getRecordDetails(record)

  const actionText: any = {
    Add: 'Added By',
    Update: 'Updated By',
  }

  return (
    <Stack spacing={2} pb={1}>
      <Box>
        <Typography
          variant={'body2'}
          fontWeight={'bold'}
          color={'text.primary'}
          gutterBottom
        >{`${actionText[recordType]}: ${getRecordCreatedBy}`}</Typography>
        <Typography variant="body2" color={'grey.600'}>
          {getRecordUpdateDate}
        </Typography>
      </Box>
      <Grid container display="flex" justifyContent={'space-between'}>
        <Grid item xs={4}>
          <Typography variant={'body2'} color="grey.600" sx={{ pr: 1 }}>
            Field Change
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant={'body2'} color="grey.600" sx={{ pr: 1 }}>
            Changed From
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant={'body2'} color="grey.600" sx={{ pr: 1 }}>
            Changed To
          </Typography>
        </Grid>
      </Grid>
      {changedFields.map((field) => (
        <Grid container key={field.name} display="flex" justifyContent={'space-between'}>
          <Grid item xs={4}>
            <Typography variant={'body2'} sx={{ pr: 1 }}>
              {field.name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant={'body2'} sx={{ pr: 1 }}>
              {field.oldValue}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant={'body2'} sx={{ pr: 1 }}>
              {field.newValue}
            </Typography>
          </Grid>
        </Grid>
      ))}
      <Box>
        <Divider />
      </Box>
    </Stack>
  )
}

const QuoteHistory = (props: QuoteHistoryProps) => {
  const { auditHistory } = props
  // Your component logic here

  return (
    <>
      {auditHistory.map((record) => (
        <QuoteHistoryItem key={record.id} record={record} />
      ))}
    </>
  )
}

export default QuoteHistory
