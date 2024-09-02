import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/landingpage/LandingPage";
import MainPage from "./pages/mainpage/MainPage";
import ChatBoard from "./pages/chatboard/ChatBoard";
import KanbanBoard from "./pages/kanbanboard/KanbanBoard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MyPage from "./pages/mypage/MyPage";
import LoginModal from "./components/LoginModal";
import AboutPage from "./pages/about/AboutPage";
import ScrolltoTop from "./components/ScrolltoTop";

// let API_URL;

// if (process.env.NODE_ENV === "production") {
//   API_URL = process.env.NODE_ENV_PROD;
// } else if (process.env.NODE_ENV === "development") {
//   API_URL = process.env.NODE_ENV_DEV;
// } else {
//   API_URL = process.env.NODE_ENV;
// }

const ChatBoardWrapper = () => {
  const { roomId } = useParams<{ roomId: string }>();
  return <ChatBoard roomId={roomId || ""} />;
};

const KanbanBoardWrapper = () => {
  const { roomId } = useParams<{ roomId: string }>();
  return <KanbanBoard roomId={roomId || ""} />;
};

const AppContent: React.FC = () => {
  const {
    isLoggedIn,
    logout,
    openLoginModal,
    showLoginModal,
    closeLoginModal,
    loginWithGoogle,
  } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={logout}
        openLoginModal={openLoginModal}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/chat/:roomId" element={<ChatBoardWrapper />} />
          <Route path="/kanban/:roomId" element={<KanbanBoardWrapper />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
      <LoginModal
        isOpen={showLoginModal}
        closeModal={closeLoginModal}
        loginWithGoogle={loginWithGoogle}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrolltoTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
