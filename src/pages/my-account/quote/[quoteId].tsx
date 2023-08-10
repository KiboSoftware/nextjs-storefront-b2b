import getConfig from 'next/config'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { CreateNewQuoteTemplate } from '@/components/page-templates'
import { useGetQuoteByID } from '@/hooks/queries/quotes/useGetQuoteById/useGetQuoteById'
import { getQuote } from '@/lib/api/operations'

import type { Quote } from '@/lib/gql/types'
import type { NextPage, GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'

interface QuotePageProps {
  quoteId: string
  quote: Quote
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, params, req, res } = context
  const { quoteId } = params as any
  const { publicRuntimeConfig } = getConfig()
  const draft = true
  const quote = await getQuote(quoteId, draft, req as NextApiRequest, res as NextApiResponse)

  if (!quote) {
    return { notFound: true }
  }

  return {
    props: {
      quote,
      quoteId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

const QuotePage: NextPage<QuotePageProps> = (props) => {
  const { t } = useTranslation('common')
  const { quoteId, quote: initialQuote } = props
  const draft = true
  const { data: quoteResult } = useGetQuoteByID({ quoteId, draft, initialQuote })
  return (
    <>
      {/* <div>a</div> */}
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <CreateNewQuoteTemplate quote={quoteResult as Quote} onAccountTitleClick={() => null} />
    </>
  )
}

export default QuotePage
