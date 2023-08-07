import { createContext, useState } from 'react'

import { GetServerSidePropsContext, NextPage } from 'next'
import getConfig from 'next/config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { QuotesTemplate } from '@/components/page-templates'
import { useGetQuotes } from '@/hooks'

import { QueryQuotesArgs } from '@/lib/gql/types'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

const QuotesPage: NextPage = (props) => {
  const { publicRuntimeConfig } = getConfig()

  const [quotesSearchParam, setQuotesSearchParam] = useState<QueryQuotesArgs>({
    filter: '',
    pageSize: parseInt(publicRuntimeConfig.B2BQuotes.pageSize),
    sortBy: 'number desc',
    startIndex: 0,
    q: '',
  })

  const sortingValues = {
    options: publicRuntimeConfig.B2BQuotes.sortOptions,
    selected: quotesSearchParam.sortBy as string,
  }

  const { data: quoteCollection } = useGetQuotes(quotesSearchParam)

  const handleQuotesSearchParam = (param: QueryQuotesArgs) => {
    setQuotesSearchParam((prevSearchParam) => ({
      ...prevSearchParam,
      filter: quotesSearchParam.filter
        ? quotesSearchParam.filter + ' or ' + param.filter
        : param.filter,
      ...param,
    }))
  }

  return (
    <>
      <QuotesTemplate
        {...props}
        quoteCollection={quoteCollection}
        sortingValues={sortingValues}
        setQuotesSearchParam={handleQuotesSearchParam}
      />
    </>
  )
}

export default QuotesPage
