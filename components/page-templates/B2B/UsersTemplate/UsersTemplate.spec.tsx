/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'

import '@testing-library/jest-dom'
import { composeStories } from '@storybook/testing-react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import mediaQuery from 'css-mediaquery'
import mockRouter from 'next-router-mock'

import * as stories from './UsersTemplate.stories' // import all stories from the stories file
import { createQueryClientWrapper } from '@/__test__/utils'
import { ModalContextProvider } from '@/context'

import { B2BUser } from '@/lib/gql/types'
const { Common } = composeStories(stories)

interface UserFormDialogProps {
  isEditMode: boolean
  isUserFormInDialog?: boolean
  formTitle?: string
  b2BUser?: B2BUser
  onSave: (data: B2BUser) => void
  onClose: () => void
}

// Mock
const onCloseMock = jest.fn()

const createMatchMedia = (width: number) => (query: string) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => jest.fn(),
  removeListener: () => jest.fn(),
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
})

jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material')
  return {
    ...originalModule,
    useTheme: jest.fn().mockReturnValue({
      breakpoints: { up: jest.fn((size) => `(max-width: ${size})`) },
      palette: {
        text: {
          primary: '#2B2B2B',
        },
      },
      typography: {
        body2: {
          fontSize: '1.5rem',
        },
      },
    }),
    useMediaQuery: jest.fn().mockReturnValue(true),
  }
})

const UserFormMock = ({ onClose }: { onClose: () => void }) => (
  <div data-testid="user-form-mock">
    <button data-testid="delete-user-mock-button" onClick={onClose}>
      Cancel
    </button>
  </div>
)
jest.mock(
  '@/components/my-account/User/UserForm/UserForm',
  () => () => UserFormMock({ onClose: onCloseMock })
)

const UserTableMock = () => <div data-testid="user-table-mock"></div>
jest.mock('../../../my-account/User/UserTable/UserTable', () => () => UserTableMock())

// const PaginationMock = () => <div data-testid="pagination-mock"></div>
// jest.mock('@mui/material', () => () => PaginationMock())

jest.mock('@/components/dialogs', () => ({
  __esModule: true,
  UserFormDialog: (props: UserFormDialogProps) => {
    const params = {
      firstName: 'Karan',
      lastName: 'Thappar',
      emailAddress: 'karan@gmail.com',
      userName: 'karan@gmail.com',
      role: 'Admin',
      isActive: true,
    }

    return (
      <div>
        <h1>user-form-dialog</h1>
        <button onClick={() => props.onSave(params)}>Confirm</button>
      </div>
    )
  },
}))

describe('[component] - UsersTemplate', () => {
  const setup = () => {
    const user = userEvent.setup()
    render(<Common />)
    return {
      user,
    }
  }

  // it('should render loader if b2b account user list not available', async () => {
  //     render(<Common />)

  //     const loader = await screen.getByRole('progressbar')
  //     expect(loader).toBeVisible()
  // })

  it('should render component', async () => {
    render(<Common />, {
      wrapper: createQueryClientWrapper(),
    })

    const addUserButton = screen.getAllByText('add-user')[0]
    expect(addUserButton).toBeVisible()

    const searchBar = screen.getByPlaceholderText('user-search-placeholder')
    expect(searchBar).toBeVisible()

    const userTable = screen.getByTestId('user-table-mock')
    expect(userTable).toBeVisible()

    const pagination = screen.getByRole('navigation', { name: 'pagination navigation' })
    expect(pagination).toBeVisible()
  })

  it('should open user form when add user button clicked in desktop view', async () => {
    render(<Common />)

    const addUserButton = screen.getAllByText('add-user')[0]
    fireEvent.click(addUserButton)

    const userForm = screen.getByTestId('user-form-mock')
    expect(userForm).toBeVisible()
  })

  it('should open user form in dialog when add user button clicked in mobile view', async () => {
    window.matchMedia = createMatchMedia(450)
    render(
      <ModalContextProvider>
        <Common />
      </ModalContextProvider>
    )

    const addUserButton = screen.getAllByText('add-user')[1]
    fireEvent.click(addUserButton)

    // const userFormDialog = await screen.findByRole('heading', { level: 1 })
    // console.log(userFormDialog)
    // expect(userFormDialog).toBeVisible()
  })

  it('should run handleSearch method when user types in search field', async () => {
    const handleSearch = jest.fn()
    const SearchBarMock = ({ handleSearch }: { handleSearch: () => void }) => (
      <div data-testid="search-bar-mock">
        <input data-testid="search-bar-input" onChange={handleSearch} />
      </div>
    )
    jest.mock('../../../common/SearchBar/SearchBar', () => () => SearchBarMock({ handleSearch }))

    render(<Common />)

    const searchBarInput = screen.getByRole('textbox', { name: 'search-input' })
    expect(searchBarInput).toBeVisible()
    // userEvent.type(searchBarInput, 'Kushagra')
    // expect(handleSearch).toHaveBeenCalled()
  })
})