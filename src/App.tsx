import NavigationRouter from './shared/utils/NavigationRouter'
import HomeSection from './features/home/views/HomePage'

import { Route } from 'react-router-dom';

import LoginSection from './features/auth/views/LoginPage';
import ProfileSection from './features/profile/views/ProfilePage';
import MatchSection from './features/match/views/matchPage';
import { ThemeProvider } from './app/contexts/ThemeContext';
import FAQSection from './features/support/views/FAQPage';
import RegisterSection from './features/auth/views/RegisterPage';
import PostPage from './features/post/views/postPage';
import CommunityPage from './features/community/views/CommunityPage';
import CommunityPag  from './features/home/components/CommunityPage';

function App() {
  return (
    <ThemeProvider>
      <NavigationRouter>
        <Route path="/" element={<HomeSection />} />
        <Route path="/login" element={<LoginSection />} />
        <Route path="/profile/:username" element={<ProfileSection />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/match" element={<MatchSection />} />
        <Route path="/register" element={<RegisterSection />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community2" element={<CommunityPag />} />
        <Route path="/support" element={<FAQSection />} />
      </NavigationRouter>
    </ThemeProvider>
  )
}

export default App
