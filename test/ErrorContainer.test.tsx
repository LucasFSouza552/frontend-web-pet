import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from './test-utils'
import ErrorContainer from '@components/ErrorContainer'
import * as ToastContextModule from '@contexts/ToastContext'

vi.mock('@contexts/ToastContext', async (importOriginal) => {
  const actual = await importOriginal<typeof ToastContextModule>()
  return {
    ...actual,
    useToast: vi.fn()
  }
})

describe('ErrorContainer', () => {
  const mockShowError = vi.fn()
  const mockShowToast = vi.fn()
  const mockRemoveToast = vi.fn()
  const mockShowSuccess = vi.fn()
  const mockShowInfo = vi.fn()
  const mockShowWarning = vi.fn()

  const mockToastContext = {
    toasts: [],
    showToast: mockShowToast,
    removeToast: mockRemoveToast,
    showError: mockShowError,
    showSuccess: mockShowSuccess,
    showInfo: mockShowInfo,
    showWarning: mockShowWarning,
  } as ReturnType<typeof ToastContextModule.useToast>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(ToastContextModule.useToast).mockReturnValue(mockToastContext)
  })

  it('deve chamar showError quando há uma mensagem de erro', async () => {
    render(<ErrorContainer message="Erro ao processar" />)
    
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Erro ao processar')
      expect(mockShowError).toHaveBeenCalledTimes(1)
    })
  })

  it('deve chamar showError quando a mensagem muda', async () => {
    const { rerender } = render(<ErrorContainer message="Primeiro erro" />)
    
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Primeiro erro')
    })
    
    rerender(<ErrorContainer message="Segundo erro" />)
    
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Segundo erro')
      expect(mockShowError).toHaveBeenCalledTimes(2)
    })
  })

  it('não deve chamar showError quando não há mensagem', () => {
    render(<ErrorContainer message="" />)
    
    expect(mockShowError).not.toHaveBeenCalled()
  })

  it('não deve renderizar nenhum elemento visível', () => {
    const { container } = render(<ErrorContainer message="Erro" />)
    
    expect(container.firstChild).toBeNull()
  })
})

