import { Route } from "react-router-dom"
import NavigationRouter from "@utils/NavigationRouter"
import { ThemeProvider } from "@contexts/ThemeContext"

// Pages
import HomePage from "@features/home/views/HomePage"
import LoginPage from "@features/account/auth/views/LoginPage"
// import ProfilePage from "@features/account/profile/views/ProfilePage"
import RegisterPage from "@features/account/auth/views/RegisterPage"
// import MatchPage from "./features/match/views/matchPage"
// import CommunityPage from "./features/community/views/CommunityPage"
import FAQPage from "@features/support/views/FAQPage"
// import InstitutePage from "./features/institution/views/InstitutePage"
// import ForgotPasswordPage from "./features/account/forgotPassword/views/forgotPasswordPage"
// import DesiredPetsPage from "./features/pet/views/DesiredPetsPage"
// import PostPage from "./features/post/views/postPage"

function App() {

  return (
    <ThemeProvider>
      <NavigationRouter>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/profile/:username" element={<ProfilePage />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/post/:id" element={<PostPage />} /> */}
        {/* <Route path="/match" element={<MatchPage />} /> */}
        {/* <Route path="/community" element={<CommunityPage />} /> */}
        <Route path="/support" element={<FAQPage />} />
        {/* <Route path="/institution/:id" element={<InstitutePage />} /> */}
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        {/* <Route path="/pets" element={<DesiredPetsPage />} /> */}
      </NavigationRouter>
    </ThemeProvider>
  )
}

export default App
