import React, { useState } from 'react'

import { Timeline, TimelineContent, TimelineItem } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { format } from 'date-fns'
import { useTranslation } from 'next-i18next'

import { KiboTextBox } from '@/components/common'
import { useAuthContext } from '@/context'
import { useGetB2BUserQueries } from '@/hooks'
import useEmailAndDate from '@/hooks/custom/useEmailAndDate/useEmailAndDate'
import { DateFormat } from '@/lib/constants'
import { quoteGetters } from '@/lib/getters'

import { QuoteComment } from '@/lib/gql/types'

interface QuotesCommentThreadProps {
  comments: QuoteComment[]
  userId: string
  mode?: string
  status?: string
  onAddComment: (comment: string) => void
}

const QuotesCommentThread = (props: QuotesCommentThreadProps) => {
  const { comments, userId, mode, status, onAddComment } = props
  const { t } = useTranslation('common')

  const [comment, setComment] = useState<string>('')
  const filter = comments.map((comment) => `userId eq ${comment.auditInfo?.createBy}`).join(' or ')
  const emailAndDate = useEmailAndDate(filter, '')

  // const handleEmailDetailsAndDate = async (createdBy: string, createdDate: string) => {
  //   const { data: b2bUserDetails } = useGetB2BUserQueries({
  //     accountId: user?.id as number,
  //     filter: `userId eq ${createdBy}`,
  //   })
  //   const dateCreated = format(new Date(createdDate), DateFormat.DATE_FORMAT_WITH_SLASH)
  //   return `${b2bUserDetails?.items?.[0]?.emailAddress}-${dateCreated}`
  // }

  const handleComment = (_: any, value: string) => {
    setComment(value)
  }

  return (
    <Box>
      {comments.length === 0 ? (
        <Typography variant="body2">{t('no-comments-added')}</Typography>
      ) : (
        <Timeline>
          {comments.map((comment) => (
            <Box key={comment?.id}>
              <TimelineItem
                key={comment.id}
                position={comment.auditInfo?.createBy === userId ? 'right' : 'left'}
              >
                <TimelineContent
                  sx={{ textAlign: comment.auditInfo?.createBy === userId ? 'right' : 'left' }}
                >
                  {format(
                    new Date(comment.auditInfo?.createDate),
                    DateFormat.DATE_FORMAT_WITH_SLASH
                  )}
                </TimelineContent>
              </TimelineItem>
              <TimelineItem
                key={comment.id}
                position={comment.auditInfo?.createBy === userId ? 'right' : 'left'}
              >
                <TimelineContent
                  sx={{ textAlign: comment.auditInfo?.createBy === userId ? 'right' : 'left' }}
                >
                  {comment.text}
                </TimelineContent>
              </TimelineItem>
            </Box>
          ))}
        </Timeline>
      )}

      {mode && status?.toLowerCase() !== 'inreview' && (
        <Box display="flex" alignItems="center" gap={2}>
          <Box flex={1}>
            <KiboTextBox
              value={comment}
              placeholder={t('type-something')}
              onChange={handleComment}
            />
          </Box>
          <Button variant="contained" color="inherit" onClick={() => onAddComment(comment)}>
            {t('add-comment')}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default QuotesCommentThread
