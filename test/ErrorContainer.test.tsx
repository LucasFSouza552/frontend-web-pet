import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from './test-utils'
import ErrorContainer from '@components/ErrorContainer'
import * as ToastContextModule from '@contexts/ToastContext'

// Mock do ToastContext usando importOriginal para manter o ToastProvider
vi.mock('@contexts/ToastContext', async (importOriginal) => {
  const actual = await importOriginal<typeof ToastContextModule>()
  return {
    ...actual,
    useToast: vi.fn()
  }
})

describe('ErrorContainer', () => {
  const mockShowError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(ToastContextModule.useToast).mockReturnValue({
      toasts: [],
      showToast: vi.fn(),
      removeToast: vi.fn(),
      showError: mockShowError,
      showSuccess: vi.fn(),
      showInfo: vi.fn(),
      showWarning: vi.fn(),
    } as any)
  })

  it('deve chamar showError quando há uma mensagem de erro', () => {
    render(<ErrorContainer message="Erro ao processar" />)
    
    expect(mockShowError).toHaveBeenCalledWith('Erro ao processar')
    expect(mockShowError).toHaveBeenCalledTimes(1)
  })

  it('deve chamar showError quando a mensagem muda', () => {
    const { rerender } = render(<ErrorContainer message="Primeiro erro" />)
    
    expect(mockShowError).toHaveBeenCalledWith('Primeiro erro')
    
    rerender(<ErrorContainer message="Segundo erro" />)
    
    expect(mockShowError).toHaveBeenCalledWith('Segundo erro')
    expect(mockShowError).toHaveBeenCalledTimes(2)
  })

  it('não deve chamar showError quando não há mensagem', () => {
    render(<ErrorContainer message="" />)
    
    expect(mockShowError).not.toHaveBeenCalled()
  })

  it('não deve renderizar nenhum elemento visível', () => {
    const { container } = render(<ErrorContainer message="Erro" />)
    
    // O componente retorna null, então não deve ter filhos
    expect(container.firstChild).toBeNull()
  })
})

