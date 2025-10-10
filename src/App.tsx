import NavigationRouter from './shared/utils/NavigationRouter'
import HomeSection from './features/home/pages/HomePage'

import { Route } from 'react-router-dom';

import LoginSection from './features/auth/pages/LoginPage';
import ProfileSection from './features/profile/pages/ProfilePage';
import MatchSection from './features/match/pages/matchPage';
import CommunityPage from './features/home/components/CommunityPage';
import { ThemeProvider } from './app/contexts/ThemeContext';
import FAQSection from './features/support/pages/FAQPage';
import RegisterSection from './features/auth/pages/RegisterPage';

function App() {
  return (
    <ThemeProvider>
      <NavigationRouter>
        <Route path="/" element={<HomeSection />} />
        <Route path="/login" element={<LoginSection />} />
        <Route path="/dashboard" element={<ProfileSection />} />
        <Route path="/match" element={<MatchSection />} />
        <Route path="/register" element={<RegisterSection />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/support" element={<FAQSection />} />
      </NavigationRouter>
    </ThemeProvider>
  )
}

export default App
