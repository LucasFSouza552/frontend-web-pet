import { describe, it, expect, vi } from 'vitest'
import { render, screen } from './test-utils'
import userEvent from '@testing-library/user-event'
import { HeaderComponent } from '@components/HeaderComponent'
import type { IAccount } from '@models/Account'

// Mock do ProfileMenu
vi.mock('@components/ProfileMenu', () => ({
  default: () => <div data-testid="profile-menu">Profile Menu</div>
}))

describe('HeaderComponent', () => {
  const mockAccount: IAccount = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'avatar.jpg'
  } as IAccount

  it('deve renderizar links de navegação', () => {
    render(<HeaderComponent />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Match')).toBeInTheDocument()
    expect(screen.getByText('Suporte')).toBeInTheDocument()
    expect(screen.getByText('Comunidade')).toBeInTheDocument()
  })

  it('deve renderizar botões de login e cadastro quando não há conta', () => {
    render(<HeaderComponent account={null} />)

    expect(screen.getByDisplayValue('Entrar')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Cadastrar')).toBeInTheDocument()
  })

  it('deve renderizar ProfileMenu quando há conta autenticada', () => {
    render(<HeaderComponent account={mockAccount} />)

    expect(screen.getByTestId('profile-menu')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Entrar')).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue('Cadastrar')).not.toBeInTheDocument()
  })

  it('deve ter links de navegação com rotas corretas', () => {
    render(<HeaderComponent />)

    const homeLink = screen.getByText('Home').closest('a')
    const matchLink = screen.getByText('Match').closest('a')
    const supportLink = screen.getByText('Suporte').closest('a')
    const communityLink = screen.getByText('Comunidade').closest('a')

    expect(homeLink).toHaveAttribute('href', '/')
    expect(matchLink).toHaveAttribute('href', '/Match')
    expect(supportLink).toHaveAttribute('href', '/support')
    expect(communityLink).toHaveAttribute('href', '/community')
  })
})
