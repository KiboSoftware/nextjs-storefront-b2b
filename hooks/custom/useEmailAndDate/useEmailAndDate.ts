// useEmailAndDate.js (custom hook)
import { useEffect, useState } from 'react'

import { format } from 'date-fns'

import { useAuthContext } from '@/context'
import { useGetB2BUserQueries } from '@/hooks/queries/b2b/useGetB2BUserQuery/useGetB2BUserQuery'
import { DateFormat } from '@/lib/constants'
const useEmailAndDate = (filter: string, createdDate: string) => {
  const [emailAndDate, setEmailAndDate] = useState('')
  const { user } = useAuthContext()
  const { data: b2bUserDetails } = useGetB2BUserQueries({
    accountId: user?.id as number,
    filter,
  })

  useEffect(() => {
    // const dateCreated = format(new Date(createdDate), DateFormat.DATE_FORMAT_WITH_SLASH)
    const emailDetails = `${b2bUserDetails?.items?.[0]?.emailAddress}`
    setEmailAndDate(emailDetails)
  }, [b2bUserDetails, createdDate])

  return emailAndDate
}

export default useEmailAndDate
