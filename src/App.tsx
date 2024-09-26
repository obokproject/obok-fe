import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import NotFound from "./pages/NotFound/NotFound";
import LoginModal from "./components/LoginModal";
import AboutPage from "./pages/about/AboutPage";
import ScrolltoTop from "./components/ScrolltoTop";
import AdminPage from "./pages/adminpage/AdminPage";
import axios from "axios";
import { Loader } from "lucide-react";

axios.defaults.withCredentials = true;

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
    openLoginModal,
    showLoginModal,
    closeLoginModal,
    loginWithGoogle,
    user,
    isAdmin,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader /> Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isLoggedIn={isLoggedIn}
        openLoginModal={openLoginModal}
        profile={user?.profile || ""}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* 로그인 했을 때만 접근 가능한 경로 */}
          {isLoggedIn ? (
            <>
              <Route path="/main" element={<MainPage />} />
              <Route path="/chat/:roomId" element={<ChatBoardWrapper />} />
              <Route path="/kanban/:roomId" element={<KanbanBoardWrapper />} />
              <Route path="/mypage" element={<MyPage />} />
              {isAdmin ? (
                <>
                  <Route path="/admin" element={<AdminPage />} />
                </>
              ) : (
                <>
                  <Route path="/admin" element={<Navigate to="/" />} />
                </>
              )}
            </>
          ) : (
            // 로그인 안 했을 때 로그인 페이지로 리다이렉트
            <>
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
          {/* path="*" 추가하여 잘못된 경로 처리 */}
          <Route path="*" element={<NotFound />} />
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
