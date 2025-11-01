import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from '@contexts/AuthContext.tsx'
import { ProfileProvider } from './shared/contexts/ProfileContext.tsx'
import { PostsProvider } from './shared/contexts/PostContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <PostsProvider>
          <App />
        </PostsProvider>
      </ProfileProvider>
    </AuthProvider>
  </StrictMode>,
)