import { describe, it, expect, vi } from 'vitest'
import { render, screen } from './test-utils'
import userEvent from '@testing-library/user-event'
import { InputComponent } from '@components/InputComponent'

describe('InputComponent', () => {
  it('deve renderizar um input de texto', () => {
    const handleChange = vi.fn()
    
    render(
      <InputComponent
        label="email"
        placeholder="Digite seu email"
        value=""
        type="text"
        onChange={handleChange}
      />
    )
    
    const input = screen.getByPlaceholderText('Digite seu email')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('deve renderizar um textarea quando type é "textarea"', () => {
    const handleChange = vi.fn()
    
    render(
      <InputComponent
        label="descricao"
        placeholder="Digite uma descrição"
        value=""
        type="textarea"
        onChange={handleChange}
      />
    )
    
    const textarea = screen.getByPlaceholderText('Digite uma descrição')
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('deve chamar onChange quando o valor é alterado', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    
    render(
      <InputComponent
        label="email"
        placeholder="Digite seu email"
        value=""
        type="text"
        onChange={handleChange}
      />
    )
    
    const input = screen.getByPlaceholderText('Digite seu email')
    await user.type(input, 'teste@email.com')
    
    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toHaveBeenCalledWith('email', 't')
    expect(handleChange).toHaveBeenCalledWith('email', 'e')
    // ... e assim por diante para cada caractere
  })

  it('deve exibir o valor atual do input', () => {
    const handleChange = vi.fn()
    
    render(
      <InputComponent
        label="email"
        placeholder="Digite seu email"
        value="usuario@email.com"
        type="text"
        onChange={handleChange}
      />
    )
    
    const input = screen.getByPlaceholderText('Digite seu email') as HTMLInputElement
    expect(input.value).toBe('usuario@email.com')
  })

  it('deve estar desabilitado quando disabled é true', () => {
    const handleChange = vi.fn()
    
    render(
      <InputComponent
        label="email"
        placeholder="Digite seu email"
        value=""
        type="text"
        onChange={handleChange}
        disabled
      />
    )
    
    const input = screen.getByPlaceholderText('Digite seu email')
    expect(input).toBeDisabled()
  })

  it('deve ter o id correto baseado no label', () => {
    const handleChange = vi.fn()
    
    render(
      <InputComponent
        label="username"
        placeholder="Nome de usuário"
        value=""
        type="text"
        onChange={handleChange}
      />
    )
    
    const input = screen.getByPlaceholderText('Nome de usuário')
    expect(input).toHaveAttribute('id', 'username')
  })

  it('deve renderizar input de senha quando type é password', () => {
    const handleChange = vi.fn()
    
    render(
      <InputComponent
        label="password"
        placeholder="Digite sua senha"
        value=""
        type="password"
        onChange={handleChange}
      />
    )
    
    const input = screen.getByPlaceholderText('Digite sua senha')
    expect(input).toHaveAttribute('type', 'password')
  })
})

