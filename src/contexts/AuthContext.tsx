import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "";

interface User {
  id: string;
  email: string;
  profile: string;
  nickname: string;
  job: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean; // 관리자 여부를 나타내는 필드
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  showLoginModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  updateUserProfile: (nickname: string) => Promise<void>;
  isLoading: boolean; // 로딩 상태
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setisLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  //사용자 로그인 상태를 확인
  const checkUserLoggedIn = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/auth/user`, {
        withCredentials: true,
      });
      if (response.data) {
        const { id, email, profile_image, nickname, job, role } = response.data;

        // profile_image를 profile로 매핑
        const user: User = {
          id,
          email,
          profile: profile_image, // profile_image를 profile로 사용
          nickname,
          job,
          role: role || "user",
        };
        setUser(user);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // 401 에러는 콘솔에 표시하지 않음
        console.log("사용자가 인증되지 않았습니다.");
      } else {
        // 다른 에러는 콘솔에 표시
        console.error("API Error:", error);
      }
    } finally {
      setisLoading(false); // 상태 확인 후 로딩 완료
    }
  };
  // 관리자 여부를 확인하는 함수
  const isAdmin = (): boolean => {
    return user?.role === "admin";
  };
  // 로그인 여부를 확인하는 함수
  const isLoggedIn = (): boolean => {
    return user?.role === "user" || user?.role === "admin";
  };

  const loginWithGoogle = async () => {
    const url = `${apiUrl}/api/auth/google`;
    console.log("Redirecting to:", url);
    window.location.href = url;
  };

  const logout = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/auth/logout`, {
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
        isLoggedIn: isLoggedIn(),
        isAdmin: isAdmin(), // isAdmin
        loginWithGoogle,
        logout,
        showLoginModal,
        openLoginModal,
        closeLoginModal,
        updateUserProfile,
        isLoading,
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
