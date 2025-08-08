import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import NewPostPage from "@/pages/NewPostPage";
import PostDetailsPage from "@/pages/PostDetailsPage";
import SessionManager from "./SessionManager";
import UserPostsPage from "@/pages/UserPosts";
import VerificationEmailPage from "@/pages/VerificationEmailPage";
import EmailVerifiedPage from "@/pages/EmailVerifiedPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UserFavoritesPage from "@/pages/UserFavoritesPage";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-muted">
        <Routes>
          <Route element={<SessionManager />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
            <Route path="/verification-email" element={<VerificationEmailPage />} />
            <Route path="/verify-email/:token" element={<EmailVerifiedPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/annonce/creation" element={<NewPostPage />} />
            <Route path="/annonce/:id" element={<PostDetailsPage />} />
            <Route path="/mes-annonces" element={<UserPostsPage />} />
            <Route path="/mes-favoris" element={<UserFavoritesPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;