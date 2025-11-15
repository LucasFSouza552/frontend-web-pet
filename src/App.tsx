import { Route } from "react-router-dom"
import NavigationRouter from "@utils/NavigationRouter"
import { ThemeProvider } from "@contexts/ThemeContext"

// Pages
import HomePage from "@features/home/views/HomePage"
import LoginPage from "@features/account/auth/views/LoginPage"
import ProfilePage from "@features/account/profile/views/ProfilePage"
import RegisterPage from "@features/account/auth/views/RegisterPage"
import MatchPage from "./features/match/views/matchPage"
import CommunityPage from "./features/community/views/CommunityPage"
import FAQPage from "@features/support/views/FAQPage"
import { useContext } from "react"
import { ProfileContext } from "@contexts/ProfileContext"
import InstitutePage from "./features/institution/views/InstitutePage"
import DonationPage from "./features/institution/views/DonationPage"
// import ForgotPasswordPage from "./features/account/forgotPassword/views/forgotPasswordPage"
// import DesiredPetsPage from "./features/pet/views/DesiredPetsPage"
import PostPage from "./features/post/views/postPage"
import ProfileEditionPage from "./features/account/profile/views/ProfileEditionPage"
import DonatePage from "@components/DonatePage"

function App() {

  const { account } = useContext(ProfileContext);

  return (
    <ThemeProvider>
      <NavigationRouter>
        <Route path="/" element={account ? <CommunityPage /> : <HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/DonatePage" element={<DonatePage />} />
        {/* <Route path="/community" element={<CommunityPage />} /> */}
        <Route path="/support" element={<FAQPage />} />
        <Route path="/institution/:id" element={<InstitutePage />} />
        <Route path="/donate" element={<DonationPage />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        {/* <Route path="/pets" element={<DesiredPetsPage />} /> */}
        <Route path="/profile-edition" element={<ProfileEditionPage />} />
      </NavigationRouter>
    </ThemeProvider>
  )
}

export default App
