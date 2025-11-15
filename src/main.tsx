import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from '@contexts/AuthContext.tsx'
import { ProfileProvider } from '@contexts/ProfileContext.tsx'
import { PostsProvider } from '@contexts/PostContext.tsx'
import { CommentsProvider } from '@contexts/CommentContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <PostsProvider>
          <CommentsProvider>
            <App />
          </CommentsProvider>
        </PostsProvider>
      </ProfileProvider>
    </AuthProvider>
  </StrictMode>,
)