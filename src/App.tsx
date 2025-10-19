import NavigationRouter from './shared/utils/NavigationRouter'
import HomeSection from './features/home/pages/HomePage'

import { Route } from 'react-router-dom';

import LoginSection from './features/auth/pages/LoginPage';
import ProfileSection from './features/profile/pages/ProfilePage';
import MatchSection from './features/match/pages/matchPage';
import { ThemeProvider } from './app/contexts/ThemeContext';
import FAQSection from './features/support/pages/FAQPage';
import RegisterSection from './features/auth/pages/RegisterPage';
import PostPage from './features/post/pages/postPage';
import CommunityPage from './features/community/pages/CommunityPage';
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
