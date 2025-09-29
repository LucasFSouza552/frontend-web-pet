import NavigationRouter from './utils/NavigationRouter'
import HomeSection from './pages/Home'

import { ThemeProvider } from "styled-components";
import { Route } from 'react-router-dom';

import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/Theme';
import LoginSection from './pages/Login';
import ProfileSection from './pages/Profile';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle theme={theme} />
      <NavigationRouter>
        <Route path="/" element={<HomeSection />} />
        <Route path="/login" element={<LoginSection />} />
        <Route path="/dashboard" element={<ProfileSection />} />
      </NavigationRouter>
    </ThemeProvider>
  )
}

export default App
