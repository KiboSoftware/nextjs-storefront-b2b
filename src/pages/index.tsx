import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { homePageResultMock } from '@/__mocks__/stories'
import { accountHierarchy } from '@/__mocks__/stories/accountHierarchy'
import AccountHierarchyTree from '@/components/b2b/AccountHierarchyTree/AccountHierarchyTree'
import KiboHeroCarousel from '@/components/home/Carousel/KiboHeroCarousel'
import getCategoryTree from '@/lib/api/operations/get-category-tree'
import { B2BRoles } from '@/lib/constants'
import type { CategoryTreeResponse, NextPageWithLayout } from '@/lib/types'

import type { GetStaticPropsContext } from 'next'

interface HomePageProps {
  carouselItem: any
}
export async function getStaticProps(context: GetStaticPropsContext) {
  const { locale } = context
  const categoriesTree: CategoryTreeResponse = await getCategoryTree()

  return {
    props: {
      categoriesTree,
      carouselItem: homePageResultMock,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

const Home: NextPageWithLayout<HomePageProps> = (props) => {
  const { carouselItem } = props
  return (
    <>
      <KiboHeroCarousel carouselItem={carouselItem || []}></KiboHeroCarousel>
      <AccountHierarchyTree
        accounts={accountHierarchy.accounts}
        hierarchy={accountHierarchy.hierarchy}
        role={B2BRoles.ADMIN}
      />
    </>
  )
}

export default Home
