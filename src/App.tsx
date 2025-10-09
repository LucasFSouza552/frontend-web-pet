import NavigationRouter from './shared/utils/NavigationRouter'
import HomeSection from './features/home/pages/HomePage'

import { ThemeProvider } from "styled-components";
import { Route } from 'react-router-dom';

import GlobalStyle from './shared/styles/GlobalStyle';
import { lightTheme, darkTheme } from './shared/styles/Theme';
import LoginSection from './features/auth/pages/LoginPage';
import ProfileSection from './features/profile/pages/ProfilePage';
import MatchSection from './features/match/pages/matchPage';
import RegisterSection from './features/auth/pages/RegisterPage';
import CommunityPage from './sections/Home/CommunityPage';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle theme={lightTheme} />
      <NavigationRouter>
        <Route path="/" element={<HomeSection />} />
        <Route path="/login" element={<LoginSection />} />
        <Route path="/dashboard" element={<ProfileSection />} />
        <Route path="/match" element={<MatchSection />} />
        <Route path="/register" element={<RegisterSection />} />
        <Route path="/community" element={<CommunityPage />} />

      </NavigationRouter>
    </ThemeProvider>
  )
}

export default App
