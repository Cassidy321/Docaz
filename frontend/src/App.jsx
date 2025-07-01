import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import NewPostPage from "@/pages/NewPostPage";
import PostDetailsPage from "@/pages/PostDetailsPage";
import SessionManager from "./SessionManager";
import MyPostsPage from "@/pages/UserPosts";
import VerificationEmailPage from "@/pages/VerificationEmailPage";

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
            <Route path="/annonce/creation" element={<NewPostPage />} />
            <Route path="/annonce/:id" element={<PostDetailsPage />} />
            <Route path="/mes-annonces" element={<MyPostsPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;