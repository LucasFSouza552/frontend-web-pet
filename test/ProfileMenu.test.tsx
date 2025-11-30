import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from './test-utils'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ProfileMenu from '@components/ProfileMenu'
import type { IAccount } from '@models/Account'
import { AuthContext } from '@contexts/AuthContext'
import { ProfileContext } from '@contexts/ProfileContext'

// Mock do navigate
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Wrapper customizado para ProfileMenu com contextos mockados
const ProfileMenuWrapper = ({ 
  children, 
  account, 
  logout 
}: { 
  children: React.ReactNode
  account: IAccount | null
  logout: () => void
}) => {
  return (
    <AuthContext.Provider value={{ 
      logout, 
      login: async () => '',
      loading: false 
    } as any}>
      <ProfileContext.Provider value={{ 
        account,
        updateAccount: vi.fn(),
        refreshAccount: vi.fn()
      } as any}>
        {children}
      </ProfileContext.Provider>
    </AuthContext.Provider>
  )
}

describe('ProfileMenu', () => {
  const mockAccount: IAccount = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'avatar.jpg'
  } as IAccount

  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar informações do perfil', () => {
    render(
      <ProfileMenuWrapper account={mockAccount} logout={mockLogout}>
        <ProfileMenu />
      </ProfileMenuWrapper>
    )

    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('deve navegar para o perfil ao clicar', async () => {
    const user = userEvent.setup()
    
    render(
      <ProfileMenuWrapper account={mockAccount} logout={mockLogout}>
        <ProfileMenu />
      </ProfileMenuWrapper>
    )

    const menu = screen.getByText('Test User').closest('div')
    if (menu) {
      await user.click(menu)
      expect(mockNavigate).toHaveBeenCalledWith('/profile/1')
    }
  })

  it('deve chamar logout ao clicar no botão Sair', async () => {
    const user = userEvent.setup()
    
    render(
      <ProfileMenuWrapper account={mockAccount} logout={mockLogout}>
        <ProfileMenu />
      </ProfileMenuWrapper>
    )

    const logoutButton = screen.getByDisplayValue('Sair')
    await user.click(logoutButton)

    expect(mockLogout).toHaveBeenCalled()
  })

  it('não deve renderizar quando não há conta', () => {
    const { container } = render(
      <ProfileMenuWrapper account={null} logout={mockLogout}>
        <ProfileMenu />
      </ProfileMenuWrapper>
    )

    expect(container.firstChild).toBeNull()
  })
})
