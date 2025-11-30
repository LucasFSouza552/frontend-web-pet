import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from './test-utils'
import userEvent from '@testing-library/user-event'
import React from 'react'
import PostModal from '@features/post/components/PostModal'

// Mock do controller
const mockUseManagePostController = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@features/post/controller/useManagePostController', () => ({
  default: () => mockUseManagePostController()
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('PostModal', () => {
  const mockCloseModal = vi.fn()
  const mockHandleAbout = vi.fn()
  const mockHandleShare = vi.fn()
  const mockOnEditPost = vi.fn()
  const mockHandleDeletePost = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseManagePostController.mockReturnValue({
      handleDeletePost: mockHandleDeletePost
    })
  })

  it('deve renderizar opções do modal', () => {
    render(
      <PostModal
        postId="123"
        closeModal={mockCloseModal}
        handleAbout={mockHandleAbout}
        handleShare={mockHandleShare}
      />
    )

    expect(screen.getByText('Ir para o post')).toBeInTheDocument()
    expect(screen.getByText('Compartilhar')).toBeInTheDocument()
    expect(screen.getByText('Sobre a conta')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('deve fechar modal ao clicar no botão de fechar', async () => {
    const user = userEvent.setup()
    render(
      <PostModal
        postId="123"
        closeModal={mockCloseModal}
        handleAbout={mockHandleAbout}
        handleShare={mockHandleShare}
      />
    )

    const closeButton = screen.getByLabelText('Fechar')
    await user.click(closeButton)

    expect(mockCloseModal).toHaveBeenCalledWith('')
  })

  it('deve navegar para o post ao clicar em "Ir para o post"', async () => {
    const user = userEvent.setup()
    render(
      <PostModal
        postId="123"
        closeModal={mockCloseModal}
        handleAbout={mockHandleAbout}
        handleShare={mockHandleShare}
      />
    )

    const goToPostButton = screen.getByText('Ir para o post')
    await user.click(goToPostButton)

    expect(mockNavigate).toHaveBeenCalledWith('/post/123')
  })

  it('deve chamar handleShare ao clicar em Compartilhar', async () => {
    const user = userEvent.setup()
    render(
      <PostModal
        postId="123"
        closeModal={mockCloseModal}
        handleAbout={mockHandleAbout}
        handleShare={mockHandleShare}
      />
    )

    const shareButton = screen.getByText('Compartilhar')
    await user.click(shareButton)

    expect(mockHandleShare).toHaveBeenCalled()
  })

  it('deve chamar handleAbout ao clicar em Sobre a conta', async () => {
    const user = userEvent.setup()
    render(
      <PostModal
        postId="123"
        closeModal={mockCloseModal}
        handleAbout={mockHandleAbout}
        handleShare={mockHandleShare}
      />
    )

    const aboutButton = screen.getByText('Sobre a conta')
    await user.click(aboutButton)

    expect(mockHandleAbout).toHaveBeenCalledWith('123')
  })

  it('deve renderizar opções de edição quando moreOptions é true', () => {
    render(
      <PostModal
        postId="123"
        moreOptions={true}
        closeModal={mockCloseModal}
        handleAbout={mockHandleAbout}
        handleShare={mockHandleShare}
        onEditPost={mockOnEditPost}
      />
    )

    expect(screen.getByText('Editar post')).toBeInTheDocument()
    expect(screen.getByText('Excluir')).toBeInTheDocument()
  })

  it('deve chamar onEditPost ao clicar em Editar post', async () => {
    const user = userEvent.setup()
    render(
      <PostModal
        postId="123"
        moreOptions={true}
        closeModal={mockCloseModal}
        handleAbout={mockHandleAbout}
        handleShare={mockHandleShare}
        onEditPost={mockOnEditPost}
      />
    )

    const editButton = screen.getByText('Editar post')
    await user.click(editButton)

    expect(mockOnEditPost).toHaveBeenCalledWith('123')
    expect(mockCloseModal).toHaveBeenCalledWith('')
  })

  it('deve mostrar modal de confirmação ao clicar em Excluir', async () => {
    const user = userEvent.setup()
    render(
      <PostModal
        postId="123"
        moreOptions={true}
        closeModal={mockCloseModal}
        handleAbout={mockHandleAbout}
        handleShare={mockHandleShare}
      />
    )

    const deleteButton = screen.getByText('Excluir')
    await user.click(deleteButton)

    expect(screen.getByText('Excluir Post')).toBeInTheDocument()
    expect(screen.getByText(/Tem certeza que deseja excluir este post/)).toBeInTheDocument()
  })

  it('deve excluir post ao confirmar exclusão', async () => {
    const user = userEvent.setup()
    mockHandleDeletePost.mockResolvedValue(undefined)

    render(
      <PostModal
        postId="123"
        moreOptions={true}
        closeModal={mockCloseModal}
        handleAbout={mockHandleAbout}
        handleShare={mockHandleShare}
      />
    )

    const deleteButton = screen.getByText('Excluir')
    await user.click(deleteButton)

    const confirmButton = screen.getByText('Confirmar')
    await user.click(confirmButton)

    await waitFor(() => {
      expect(mockHandleDeletePost).toHaveBeenCalledWith('123')
      expect(mockCloseModal).toHaveBeenCalledWith('')
    })
  })

  it('deve cancelar exclusão ao clicar em Cancelar', async () => {
    const user = userEvent.setup()
    render(
      <PostModal
        postId="123"
        moreOptions={true}
        closeModal={mockCloseModal}
        handleAbout={mockHandleAbout}
        handleShare={mockHandleShare}
      />
    )

    const deleteButton = screen.getByText('Excluir')
    await user.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('Excluir Post')).toBeInTheDocument()
    })

    // O botão Cancelar no modal de confirmação tem um ícone, então vamos buscar pelo texto dentro do botão
    const cancelButtons = screen.getAllByText('Cancelar')
    // O último botão Cancelar deve ser o do modal de confirmação
    const modalCancelButton = cancelButtons[cancelButtons.length - 1]
    await user.click(modalCancelButton)

    await waitFor(() => {
      expect(screen.queryByText('Excluir Post')).not.toBeInTheDocument()
    })
  })
})
