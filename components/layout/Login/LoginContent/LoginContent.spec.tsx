/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react'

import { composeStories } from '@storybook/testing-react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from './LoginContent.stories' // import all stories from the stories file

const { Common } = composeStories(stories)

const onForgotPasswordClickMock = jest.fn()
const onLoginMock = jest.fn()

describe('[components] (LoginContent)', () => {
  const email = 'test@gmail.com'

  const setup = (args = Common.args) =>
    render(
      <Common {...args} onLogin={onLoginMock} onForgotPasswordClick={onForgotPasswordClickMock} />
    )

  it('should render component', async () => {
    setup()

    const emailInput = screen.getByRole('textbox', { name: 'email' })
    const passwordInput = screen.getByLabelText('password')
    const eyeIcon = screen.getByRole('button', { name: 'toggle password visibility' })
    const rememberMeCheckbox = screen.getByRole('checkbox', { name: 'Remember Me' })
    const loginButton = screen.getByRole('button', { name: 'common:log-in' })
    const forgotPasswordLink = screen.getByRole('button', { name: 'common:forgot-password' })

    expect(emailInput).toBeVisible()
    expect(passwordInput).toBeVisible()
    expect(eyeIcon).toBeVisible()
    expect(rememberMeCheckbox).toBeInTheDocument()
    expect(loginButton).toBeVisible()
    expect(loginButton).toBeDisabled()
    expect(forgotPasswordLink).toBeVisible()
  })

  it('should show input values when user enters inputs', async () => {
    setup()

    const emailInput = screen.getByRole('textbox', { name: 'email' })
    const passwordInput = screen.getByLabelText('password')

    await act(async () => {
      userEvent.clear(emailInput)
      userEvent.type(emailInput, email)
    })
    expect(emailInput).toHaveValue('test@gmail.com')

    await act(async () => {
      userEvent.clear(passwordInput)
      userEvent.type(passwordInput, 'abc')
    })
    expect(passwordInput).toHaveValue('abc')
  })

  it('should disable login button when user enters invalid inputs ', async () => {
    setup()

    const emailInput = screen.getByRole('textbox', { name: 'email' })
    const passwordInput = screen.getByLabelText('password')
    const loginButton = screen.getByRole('button', { name: 'common:log-in' })

    expect(loginButton).toBeDisabled()

    // invalid inputs
    await act(async () => {
      userEvent.clear(emailInput)
      userEvent.type(emailInput, 'abcd-email')
      userEvent.clear(passwordInput)
      userEvent.type(passwordInput, 'abc')
    })
    expect(loginButton).toBeDisabled()
  })

  it('should enable login button when user enters valid inputs and  call onLoginMock when user click onLogin ', async () => {
    setup()

    const emailInput = screen.getByRole('textbox', { name: 'email' })
    const passwordInput = screen.getByLabelText('password')
    const loginButton = screen.getByRole('button', { name: 'common:log-in' })

    // valid inputs
    await act(async () => {
      userEvent.clear(emailInput)
      userEvent.type(emailInput, email)
    })

    await act(async () => {
      userEvent.clear(passwordInput)
      userEvent.type(passwordInput, 'abc')
    })

    expect(loginButton).toBeEnabled()
    await act(async () => {
      userEvent.click(loginButton)
    })

    expect(onLoginMock).toBeCalled()
  })

  it('should call onForgotPasswordClickMock when click forgotPasswordLink', async () => {
    setup()
    const forgotPasswordLink = screen.getByRole('button', { name: 'common:forgot-password' })
    await act(async () => {
      userEvent.click(forgotPasswordLink)
    })
    expect(onForgotPasswordClickMock).toBeCalled()
  })
})
