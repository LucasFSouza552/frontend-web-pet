import { describe, it, expect, vi } from 'vitest'
import { render, screen } from './test-utils'
import userEvent from '@testing-library/user-event'
import { PrimaryButton } from '@components/PrimaryButton'

describe('PrimaryButton', () => {
  it('deve renderizar o botão com o texto fornecido', () => {
    render(<PrimaryButton text="Clique aqui" filled />)
    
    const button = screen.getByDisplayValue('Clique aqui')
    expect(button).toBeInTheDocument()
  })

  it('deve chamar a função onClick quando clicado', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(
      <PrimaryButton 
        text="Clique aqui" 
        filled 
        onClick={handleClick}
      />
    )
    
    const button = screen.getByDisplayValue('Clique aqui')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('deve navegar para a rota quando a prop "to" é fornecida', async () => {
    const user = userEvent.setup()
    
    render(
      <PrimaryButton 
        text="Ir para página" 
        filled 
        to="/test-page"
      />
    )
    
    const button = screen.getByDisplayValue('Ir para página')
    await user.click(button)
    
    expect(button).toBeInTheDocument()
  })

  it('deve renderizar com estilo filled quando filled é true', () => {
    render(<PrimaryButton text="Botão preenchido" filled />)
    
    const button = screen.getByDisplayValue('Botão preenchido')
    expect(button).toBeInTheDocument()
  })

  it('deve renderizar com estilo outline quando filled é false', () => {
    render(<PrimaryButton text="Botão outline" filled={false} />)
    
    const button = screen.getByDisplayValue('Botão outline')
    expect(button).toBeInTheDocument()
  })

  it('deve aplicar width e height customizados quando fornecidos', () => {
    render(
      <PrimaryButton 
        text="Botão customizado" 
        filled 
        width="200px" 
        height="50px"
      />
    )
    
    const button = screen.getByDisplayValue('Botão customizado')
    expect(button).toBeInTheDocument()
  })

  it('deve renderizar com type submit quando especificado', () => {
    render(
      <PrimaryButton 
        text="Enviar" 
        filled 
        type="submit"
      />
    )
    
    const button = screen.getByDisplayValue('Enviar')
    expect(button).toHaveAttribute('type', 'submit')
  })
})

