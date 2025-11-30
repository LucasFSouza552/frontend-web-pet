import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from './test-utils'
import userEvent from '@testing-library/user-event'
import CommentCard from '@features/post/components/CommentCard'
import type { IComment } from '@models/Comments'

// Mock do SmallProfile
vi.mock('@components/SmallProfile', () => ({
  default: ({ account }: any) => <div data-testid="small-profile">{account.name}</div>
}))

describe('CommentCard', () => {
  const mockComment: IComment = {
    id: '1',
    content: 'Este é um comentário de teste',
    account: {
      id: 'user1',
      name: 'Test User',
      avatar: 'avatar.jpg'
    },
    createdAt: new Date().toISOString()
  } as IComment

  const mockOnReply = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar conteúdo do comentário', () => {
    render(
      <CommentCard
        comment={mockComment}
        onReply={mockOnReply}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Este é um comentário de teste')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('deve mostrar opção de responder', () => {
    render(
      <CommentCard
        comment={mockComment}
        onReply={mockOnReply}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Responder')).toBeInTheDocument()
  })

  it('deve abrir campo de resposta ao clicar em Responder', async () => {
    const user = userEvent.setup()
    render(
      <CommentCard
        comment={mockComment}
        onReply={mockOnReply}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const replyButton = screen.getByText('Responder')
    await user.click(replyButton)

    expect(screen.getByPlaceholderText('Escreva uma resposta...')).toBeInTheDocument()
  })

  it('deve enviar resposta ao preencher e clicar em Responder', async () => {
    const user = userEvent.setup()
    mockOnReply.mockResolvedValue(undefined)

    render(
      <CommentCard
        comment={mockComment}
        onReply={mockOnReply}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const replyButton = screen.getByText('Responder')
    await user.click(replyButton)

    const replyInput = screen.getByPlaceholderText('Escreva uma resposta...')
    await user.type(replyInput, 'Esta é uma resposta')

    // Pegar o botão de enviar resposta (dentro do ReplyBox, não o link de abrir)
    const replyButtons = screen.getAllByText('Responder')
    const sendButton = replyButtons.find(button => button.tagName === 'BUTTON') || replyButtons[replyButtons.length - 1]
    await user.click(sendButton)

    await waitFor(() => {
      expect(mockOnReply).toHaveBeenCalledWith('1', 'Esta é uma resposta')
    })
  })

  it('deve mostrar opções de editar e excluir quando é o dono do comentário', () => {
    render(
      <CommentCard
        comment={mockComment}
        onReply={mockOnReply}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        currentUserId="user1"
      />
    )

    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Excluir')).toBeInTheDocument()
  })

  it('não deve mostrar opções de editar e excluir quando não é o dono', () => {
    render(
      <CommentCard
        comment={mockComment}
        onReply={mockOnReply}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        currentUserId="user2"
      />
    )

    expect(screen.queryByText('Editar')).not.toBeInTheDocument()
    expect(screen.queryByText('Excluir')).not.toBeInTheDocument()
  })

  it('deve entrar em modo de edição ao clicar em Editar', async () => {
    const user = userEvent.setup()
    render(
      <CommentCard
        comment={mockComment}
        onReply={mockOnReply}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        currentUserId="user1"
      />
    )

    const editButton = screen.getByText('Editar')
    await user.click(editButton)

    const textarea = screen.getByDisplayValue('Este é um comentário de teste')
    expect(textarea).toBeInTheDocument()
    expect(screen.getByText('Salvar')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('deve salvar edição ao clicar em Salvar', async () => {
    const user = userEvent.setup()
    mockOnEdit.mockResolvedValue(undefined)

    render(
      <CommentCard
        comment={mockComment}
        onReply={mockOnReply}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        currentUserId="user1"
      />
    )

    const editButton = screen.getByText('Editar')
    await user.click(editButton)

    const textarea = screen.getByDisplayValue('Este é um comentário de teste')
    await user.clear(textarea)
    await user.type(textarea, 'Comentário editado')

    const saveButton = screen.getByText('Salvar')
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith('1', 'Comentário editado')
    })
  })

  it('deve cancelar edição ao clicar em Cancelar', async () => {
    const user = userEvent.setup()
    render(
      <CommentCard
        comment={mockComment}
        onReply={mockOnReply}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        currentUserId="user1"
      />
    )

    const editButton = screen.getByText('Editar')
    await user.click(editButton)

    const cancelButton = screen.getByText('Cancelar')
    await user.click(cancelButton)

    expect(screen.getByText('Este é um comentário de teste')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Este é um comentário de teste')).not.toBeInTheDocument()
  })

  it('deve chamar onDelete ao clicar em Excluir', async () => {
    const user = userEvent.setup()
    mockOnDelete.mockResolvedValue(undefined)

    render(
      <CommentCard
        comment={mockComment}
        onReply={mockOnReply}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        currentUserId="user1"
      />
    )

    const deleteButton = screen.getByText('Excluir')
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })
})
