# Testes de Interface

Este projeto utiliza **Vitest** e **React Testing Library** para testes de interface de componentes React.

## Por que Vitest ao invés de Jest?

- ✅ **Integração nativa com Vite**: O projeto já usa Vite, então Vitest é a escolha natural
- ✅ **Mais rápido**: Vitest é otimizado para projetos Vite
- ✅ **Suporte ESM nativo**: Sem necessidade de configuração adicional
- ✅ **API compatível com Jest**: Fácil migração se você já conhece Jest
- ✅ **Interface gráfica**: Comando `npm run test:ui` para visualização interativa

## Estrutura de Testes

```
src/
├── test/
│   ├── setup.ts          # Configuração global dos testes
│   ├── test-utils.tsx    # Helper com providers para renderização
│   └── README.md         # Esta documentação
├── shared/
│   └── components/
│       ├── PrimaryButton.tsx
│       ├── PrimaryButton.test.tsx  # Teste do componente
│       └── ...
└── features/
    └── account/
        └── auth/
            └── components/
                ├── AuthForm.tsx
                └── AuthForm.test.tsx
```

## Comandos Disponíveis

```bash
# Rodar testes em modo watch (re-executa ao salvar arquivos)
npm test

# Rodar testes uma vez
npm run test:run

# Rodar testes com interface gráfica
npm run test:ui

# Rodar testes com relatório de cobertura
npm run test:coverage
```

## Como Escrever Testes

### Exemplo Básico

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/test-utils'
import { PrimaryButton } from './PrimaryButton'

describe('PrimaryButton', () => {
  it('deve renderizar o botão com o texto fornecido', () => {
    render(<PrimaryButton text="Clique aqui" filled />)
    
    const button = screen.getByDisplayValue('Clique aqui')
    expect(button).toBeInTheDocument()
  })
})
```

### Testando Interações do Usuário

```typescript
import userEvent from '@testing-library/user-event'

it('deve chamar onClick quando clicado', async () => {
  const handleClick = vi.fn()
  const user = userEvent.setup()
  
  render(<PrimaryButton text="Clique" filled onClick={handleClick} />)
  
  const button = screen.getByDisplayValue('Clique')
  await user.click(button)
  
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Mockando Contextos e Hooks

```typescript
import * as ControllerModule from '../controllers/useLoginController'

vi.mock('../controllers/useLoginController', () => ({
  default: vi.fn()
}))

// No beforeEach
vi.mocked(ControllerModule.default).mockReturnValue({
  credentials: { email: '', password: '' },
  error: '',
  handleChange: mockHandleChange,
  handleLogin: mockHandleLogin
})
```

## Helpers Disponíveis

### `render` (do test-utils)

A função `render` customizada já inclui todos os providers necessários:
- `BrowserRouter` (React Router)
- `ThemeProvider`
- `ToastProvider`
- `AuthProvider`
- `ProfileProvider`
- `PostsProvider`
- `CommentsProvider`

```typescript
import { render } from '../../test/test-utils'

// Não precisa wrappear manualmente com providers
render(<MeuComponente />)
```

## Boas Práticas

1. **Teste o comportamento, não a implementação**: Foque no que o usuário vê e faz
2. **Use queries semânticas**: Prefira `getByRole`, `getByLabelText` ao invés de `getByTestId`
3. **Isole os testes**: Cada teste deve ser independente
4. **Mock apenas o necessário**: Não mocke tudo, apenas o que é externo ou difícil de testar
5. **Mantenha os testes simples**: Um teste deve verificar uma coisa

## Exemplos de Testes Criados

- ✅ `PrimaryButton.test.tsx` - Testes de renderização, interação e props
- ✅ `InputComponent.test.tsx` - Testes de inputs, textarea e estados
- ✅ `ErrorContainer.test.tsx` - Testes de integração com contexto
- ✅ `AuthForm.test.tsx` - Testes de formulário completo com mocks

## Próximos Passos

Para adicionar testes E2E (end-to-end) completos, considere adicionar:
- **Cypress** ou **Playwright** para testes de fluxos completos
- Testes de integração entre múltiplos componentes
- Testes de acessibilidade

