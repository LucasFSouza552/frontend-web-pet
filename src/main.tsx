import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './features/auth/AuthContext.tsx'
import { PostsProvider } from './features/post/postContext.tsx'
import { ProfileProvider } from './features/profile/profileContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfileProvider>
      <AuthProvider>
        <PostsProvider>
          <App />
        </PostsProvider>
      </AuthProvider>
    </ProfileProvider>
  </StrictMode>,
)


