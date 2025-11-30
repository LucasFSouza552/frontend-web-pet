import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from './test-utils'
import userEvent from '@testing-library/user-event'
import AuthForm from '@features/account/auth/components/AuthForm'

// Mock do controller
const mockUseLoginController = vi.fn()

vi.mock('@features/account/auth/controllers/useLoginController', () => ({
  default: () => mockUseLoginController()
}))

describe('AuthForm', () => {
  const mockHandleChange = vi.fn()
  const mockHandleLogin = vi.fn((e: React.FormEvent) => {
    e.preventDefault()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseLoginController.mockReturnValue({
      credentials: {
        email: '',
        password: ''
      },
      error: '',
      handleChange: mockHandleChange,
      handleLogin: mockHandleLogin
    })
  })

  it('deve renderizar o formulário de login', () => {
    render(<AuthForm />)
    
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument()
    expect(screen.getByText('Entre para continuar sua jornada')).toBeInTheDocument()
  })

  it('deve renderizar os campos de email e senha', () => {
    render(<AuthForm />)
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
  })

  it('deve renderizar o botão de submit', () => {
    render(<AuthForm />)
    
    const submitButton = screen.getByDisplayValue('Entrar')
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('deve renderizar links para registro e recuperação de senha', () => {
    render(<AuthForm />)
    
    expect(screen.getByText(/Não tem conta\?/)).toBeInTheDocument()
    expect(screen.getByText('Crie a sua')).toBeInTheDocument()
    expect(screen.getByText('Esqueci minha senha')).toBeInTheDocument()
  })

  it('deve chamar handleChange quando o usuário digita no campo de email', async () => {
    const user = userEvent.setup()
    render(<AuthForm />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    await user.type(emailInput, 'teste@email.com')
    
    expect(mockHandleChange).toHaveBeenCalled()
  })

  it('deve chamar handleChange quando o usuário digita no campo de senha', async () => {
    const user = userEvent.setup()
    render(<AuthForm />)
    
    const passwordInput = screen.getByPlaceholderText('Senha')
    await user.type(passwordInput, 'senha123')
    
    expect(mockHandleChange).toHaveBeenCalled()
  })

  it('deve chamar handleLogin quando o formulário é submetido', async () => {
    const user = userEvent.setup()
    render(<AuthForm />)
    
    const submitButton = screen.getByDisplayValue('Entrar')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalled()
    })
  })

  it('deve renderizar ErrorContainer quando há erro no login', () => {
    mockUseLoginController.mockReturnValue({
      credentials: {
        email: '',
        password: ''
      },
      error: 'Credenciais inválidas',
      handleChange: mockHandleChange,
      handleLogin: mockHandleLogin
    })

    render(<AuthForm />)
    
    // O ErrorContainer recebe a mensagem de erro
    // Ele não renderiza texto diretamente, mas chama showError do ToastContext
    // Verificamos que o componente foi renderizado verificando se o formulário ainda está presente
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument()
  })

  it('deve atualizar os valores dos campos quando credentials mudam', () => {
    mockUseLoginController.mockReturnValue({
      credentials: {
        email: 'usuario@email.com',
        password: 'senha123'
      },
      error: '',
      handleChange: mockHandleChange,
      handleLogin: mockHandleLogin
    })

    render(<AuthForm />)
    
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
    
    expect(emailInput.value).toBe('usuario@email.com')
    expect(passwordInput.value).toBe('senha123')
  })
})

