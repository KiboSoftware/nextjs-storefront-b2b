import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { QuickOrderTemplate } from '@/components/page-templates'

import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

const QuickOrderPage: NextPage = () => {
  return (
    <>
      <QuickOrderTemplate />
    </>
  )
}

export default QuickOrderPage
