import NavigationRouter from './utils/NavigationRouter'
import HomeSection from './features/home/pages/HomePage'

import { ThemeProvider } from "styled-components";
import { Route } from 'react-router-dom';

import GlobalStyle from './shared/styles/GlobalStyle';
import { lightTheme, darkTheme } from './shared/styles/Theme';
import LoginSection from './features/auth/pages/LoginPage';
import ProfileSection from './features/profile/pages/ProfilePage';
import { useContext } from 'react';
import MatchSection from './features/match/pages/matchPage';
import RegisterSection from './features/auth/pages/RegisterPage';
import { AuthContext } from './app/contexts/AuthContext';

function App() {

  const { account, token, logout } = useContext(AuthContext);
  console.log('account: ', account);

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle theme={darkTheme} />
      <NavigationRouter>
        <Route path="/" element={<HomeSection />} />
        <Route path="/login" element={<LoginSection />} />
        <Route path="/dashboard" element={<ProfileSection />} />
        <Route path="/match" element={<MatchSection />} />
        <Route path="/register" element={<RegisterSection />} />
      </NavigationRouter>
    </ThemeProvider>
  )
}

export default App
