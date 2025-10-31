import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './features/auth/AuthContext.tsx'
import { PostsProvider } from './features/post/PostContext.tsx'
import { ProfileProvider } from './features/profile/ProfileContext.tsx'


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