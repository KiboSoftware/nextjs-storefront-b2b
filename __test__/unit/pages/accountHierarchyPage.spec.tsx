import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { b2BAccountHierarchyResult } from '@/__mocks__/stories'
import { createQueryClientWrapper } from '@/__test__/utils'
import { buildAccountHierarchy } from '@/lib/helpers'
import AccountHierarchyPage, { getServerSideProps } from '@/pages/my-account/b2b/account-hierarchy'

const hierarchyMock = b2BAccountHierarchyResult
jest.mock('@/lib/api/util/fetch-gql.ts', () => {
  return jest.fn(() => {
    return Promise.resolve({
      data: { getB2BAccountHierarchy: hierarchyMock },
    })
  })
})

jest.mock('@/lib/api/util/getUserClaimsFromRequest.ts', () => jest.fn(() => null))
jest.mock('@/lib/api/util/get-additional-header.ts', () => jest.fn(() => null))

jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn(() => {
    return Promise.resolve({
      _nextI18Next: {
        initialI18nStore: { 'mock-locale': [{}], en: [{}] },
        initialLocale: 'mock-locale',
        userConfig: { i18n: [{}] },
      },
    })
  }),
}))

const AccountHierarchyTemplateMock = () => <div data-testid="account-hierarchy-template-mock" />
jest.mock(
  '@/components/page-templates/B2B/AccountHierarchyTemplate/AccountHierarchyTemplate',
  () => () => AccountHierarchyTemplateMock()
)

const mockNextI18Next = {
  initialI18nStore: { 'mock-locale': [{}], en: [{}] },
  initialLocale: 'mock-locale',
  userConfig: { i18n: [{}] },
}

describe('[page] Account Hierarchy Page', () => {
  it('should run getServerSideProps method', async () => {
    const context = {
      locale: 'mock-locale',
      req: {
        cookies: {
          kibo_at: 'test-cookie',
        },
      },
    }

    const response = await getServerSideProps(context as any)

    const hierarchy = buildAccountHierarchy(b2BAccountHierarchyResult?.accounts)

    expect(response).toStrictEqual({
      props: {
        initialData: {
          accounts: b2BAccountHierarchyResult.accounts,
          hierarchy,
        },
        _nextI18Next: mockNextI18Next,
      },
    })
  })

  it('should render the Account Hierarchy page', () => {
    render(<AccountHierarchyPage />, {
      wrapper: createQueryClientWrapper(),
    })

    const usersTemplate = screen.getByTestId('account-hierarchy-template-mock')
    expect(usersTemplate).toBeVisible()
  })
})
