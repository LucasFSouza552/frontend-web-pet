import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from '@contexts/AuthContext.tsx'
import { ProfileProvider } from '@contexts/ProfileContext.tsx'
import { PostsProvider } from '@contexts/PostContext.tsx'
import { CommentsProvider } from '@contexts/CommentContext.tsx'
import { ToastProvider } from '@contexts/ToastContext.tsx'
import { ErrorBoundary } from '@Error/ErrorBoundary.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <ProfileProvider>
            <PostsProvider>
              <CommentsProvider>
                <App />
              </CommentsProvider>
            </PostsProvider>
          </ProfileProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
)