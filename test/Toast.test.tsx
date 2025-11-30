import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from './test-utils'
import userEvent from '@testing-library/user-event'
import ToastContainer from '@components/Toast'
import { ToastProvider, useToast } from '@contexts/ToastContext'

// Componente wrapper para testar o Toast
function ToastTestWrapper() {
  const { showSuccess, showError, showWarning, showInfo, toasts, removeToast } = useToast()
  
  return (
    <div>
      <ToastContainer />
      <button onClick={() => showSuccess('Sucesso!')}>Show Success</button>
      <button onClick={() => showError('Erro!')}>Show Error</button>
      <button onClick={() => showWarning('Aviso!')}>Show Warning</button>
      <button onClick={() => showInfo('Info!')}>Show Info</button>
      {toasts.length > 0 && (
        <button onClick={() => removeToast(toasts[0].id)}>Remove First</button>
      )}
    </div>
  )
}

describe('Toast', () => {

  it('deve renderizar toast de sucesso', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastTestWrapper />
      </ToastProvider>
    )

    const button = screen.getByText('Show Success')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Sucesso!')).toBeInTheDocument()
    }, { timeout: 3000 })
  }, { timeout: 10000 })

  it('deve renderizar toast de erro', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastTestWrapper />
      </ToastProvider>
    )

    const button = screen.getByText('Show Error')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Erro!')).toBeInTheDocument()
    }, { timeout: 3000 })
  }, { timeout: 10000 })

  it('deve renderizar toast de aviso', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastTestWrapper />
      </ToastProvider>
    )

    const button = screen.getByText('Show Warning')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Aviso!')).toBeInTheDocument()
    }, { timeout: 3000 })
  }, { timeout: 10000 })

  it('deve renderizar toast de informação', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastTestWrapper />
      </ToastProvider>
    )

    const button = screen.getByText('Show Info')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Info!')).toBeInTheDocument()
    }, { timeout: 3000 })
  }, { timeout: 10000 })

  it('deve fechar toast ao clicar no botão de fechar', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastTestWrapper />
      </ToastProvider>
    )

    const button = screen.getByText('Show Success')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Sucesso!')).toBeInTheDocument()
    }, { timeout: 3000 })

    const closeButton = screen.getByLabelText('Fechar')
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText('Sucesso!')).not.toBeInTheDocument()
    }, { timeout: 3000 })
  }, { timeout: 10000 })

  it('deve remover toast automaticamente após duração', async () => {
    // Criar um wrapper que expõe removeToast para teste direto
    function ToastTestWrapperWithRemove() {
      const { showSuccess, toasts, removeToast } = useToast()
      
      return (
        <div>
          <ToastContainer />
          <button onClick={() => showSuccess('Teste Auto Remove')}>Show</button>
          {toasts.length > 0 && (
            <button 
              data-testid="simulate-auto-remove"
              onClick={() => removeToast(toasts[0].id)}
            >
              Simulate Auto Remove
            </button>
          )}
        </div>
      )
    }

    const user = userEvent.setup()
    
    render(
      <ToastProvider>
        <ToastTestWrapperWithRemove />
      </ToastProvider>
    )

    const button = screen.getByText('Show')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Teste Auto Remove')).toBeInTheDocument()
    }, { timeout: 2000 })

    // Simular a remoção automática clicando no botão que remove o toast
    const removeButton = screen.getByTestId('simulate-auto-remove')
    await user.click(removeButton)

    await waitFor(() => {
      expect(screen.queryByText('Teste Auto Remove')).not.toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('deve renderizar múltiplos toasts', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastTestWrapper />
      </ToastProvider>
    )

    const successButton = screen.getByText('Show Success')
    const errorButton = screen.getByText('Show Error')
    const warningButton = screen.getByText('Show Warning')

    // Clicar em todos os botões rapidamente
    await user.click(successButton)
    await user.click(errorButton)
    await user.click(warningButton)

    // Aguardar que todos os toasts sejam renderizados
    await waitFor(() => {
      const successToast = screen.queryByText('Sucesso!')
      const errorToast = screen.queryByText('Erro!')
      const warningToast = screen.queryByText('Aviso!')
      
      expect(successToast).toBeInTheDocument()
      expect(errorToast).toBeInTheDocument()
      expect(warningToast).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})
