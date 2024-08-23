import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  profile: string;
  nickname?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  showLoginModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  updateUserProfile: (nickname: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  //사용자 로그인 상태를 확인
  const checkUserLoggedIn = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/auth/user`, {
        withCredentials: true,
      });
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      // if (axios.isAxiosError(error)) {
      //   console.error("API Error:", error.response?.data);
      // } else {
      //   console.error("An unexpected error occurred:", error);
      // }
    }
  };

  const loginWithGoogle = async () => {
    const url = "http://localhost:5000/auth/google";
    console.log("Redirecting to:", url);
    window.location.href = url;
  };

  const logout = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/logout", {
        withCredentials: true, // 세션 쿠키 포함
      });
      if (response.status === 200) {
        window.location.href = "/"; // 성공적으로 로그아웃 후 클라이언트에서 리디렉션 처리
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const updateUserProfile = async (nickname: string) => {
    if (user) {
      const updatedUser = { ...user, nickname };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loginWithGoogle,
        logout,
        showLoginModal,
        openLoginModal,
        closeLoginModal,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
