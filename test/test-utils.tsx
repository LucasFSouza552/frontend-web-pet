import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@contexts/ThemeContext'
import { AuthProvider } from '@contexts/AuthContext'
import { ProfileProvider } from '@contexts/ProfileContext'
import { PostsProvider } from '@contexts/PostContext'
import { CommentsProvider } from '@contexts/CommentContext'
import { ToastProvider } from '@contexts/ToastContext'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <ProfileProvider>
              <PostsProvider>
                <CommentsProvider>
                  {children}
                </CommentsProvider>
              </PostsProvider>
            </ProfileProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

// Função customizada de render que inclui os providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-exportar tudo do React Testing Library
export * from '@testing-library/react'
export { customRender as render }

