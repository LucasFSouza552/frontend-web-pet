import NavigationRouter from './utils/NavigationRouter'
import HomeSection from './pages/Home'

import { ThemeProvider } from "styled-components";
import { Route } from 'react-router-dom';

import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/Theme';
import LoginSection from './pages/Login';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

function App() {

  const { account, token, logout } = useContext(AuthContext);
  console.log(account);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle theme={theme} />
      <NavigationRouter>
        <Route path="/" element={<HomeSection />} />
        <Route path="/login" element={<LoginSection />} />
      </NavigationRouter>
    </ThemeProvider>
  )
}

export default App
