import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import SessionManager from "./SessionManager";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-muted">
        <Routes>
          <Route element={<SessionManager />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;