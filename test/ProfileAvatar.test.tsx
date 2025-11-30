import { describe, it, expect } from 'vitest'
import { render, screen } from './test-utils'
import ProfileAvatar from '@components/ProfileAvatar'

// Mock do pictureService
vi.mock('@api/pictureService', () => ({
  pictureService: {
    fetchPicture: (path: string) => path || '/default-avatar.png'
  }
}))

describe('ProfileAvatar', () => {
  it('deve renderizar avatar com imagem', () => {
    render(<ProfileAvatar avatar="avatar.jpg" alt="User Avatar" />)

    const img = screen.getByAltText('User Avatar')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'avatar.jpg')
  })

  it('deve usar imagem padrão quando avatar não é fornecido', () => {
    render(<ProfileAvatar alt="User Avatar" />)

    const img = screen.getByAltText('User Avatar')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/default-avatar.png')
  })

  it('deve aplicar width customizado', () => {
    const { container } = render(
      <ProfileAvatar avatar="avatar.jpg" alt="User Avatar" width={60} />
    )

    const avatarContainer = container.querySelector('div')
    expect(avatarContainer).toHaveStyle({ width: '60px', height: '60px' })
  })

  it('deve aplicar border quando prop border é true', () => {
    const { container } = render(
      <ProfileAvatar avatar="avatar.jpg" alt="User Avatar" border={true} />
    )

    const avatarContainer = container.querySelector('div')
    expect(avatarContainer).toBeInTheDocument()
  })
})
