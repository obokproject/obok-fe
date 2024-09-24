import React, { useState, useEffect, useCallback } from "react";
import { Container, Tab, Tabs, Form } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader } from "lucide-react";

const apiUrl = process.env.REACT_APP_API_URL || "";

interface MonthlySignup {
  month: number;
  count: number;
}

interface User {
  id: string;
  social_id: string;
  social_type: string;
  job: string;
  email: string;
  nickname: string;
  role: string;
  last_login_at: string;
  createdAt: string;
}
const AdminPage: React.FC = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [monthlySignups, setMonthlySignups] = useState<MonthlySignup[]>([]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([currentYear]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // 현재 페이지의 사용자 가져오기
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // 페이지 변경 함수
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("사용자 목록 조회 중 오류 발생:", error);
    }
  }, []);
  const fetchAvailableYears = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/available-years`);
      setAvailableYears(response.data);
    } catch (error) {
      console.error("연도 목록 조회 중 오류 발생:", error);
    }
  }, []);

  const fetchMonthlySignups = useCallback(async (year: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/admin/monthly-signups/${year}`
      );
      setMonthlySignups(response.data);
    } catch (error) {
      console.error("월별 가입자 통계 조회 중 오류 발생:", error);
    }
  }, []);

  useEffect(() => {
    const initializeAdminPage = async () => {
      if (isLoggedIn && isAdmin) {
        await Promise.all([
          fetchUsers(),
          fetchAvailableYears(),
          fetchMonthlySignups(selectedYear),
        ]);
      }
      setLoading(false);
    };

    initializeAdminPage();
  }, [
    isLoggedIn,
    isAdmin,
    fetchUsers,
    fetchAvailableYears,
    fetchMonthlySignups,
    selectedYear,
  ]);

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      fetchMonthlySignups(selectedYear);
    }
  }, [selectedYear, isLoggedIn, isAdmin, fetchMonthlySignups]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader /> Loading...
      </div>
    );
  }

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("정말로 이 사용자를 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${apiUrl}/api/admin/users/${id}`);
        fetchUsers(); // 사용자 목록 새로고침
      } catch (error) {
        console.error("사용자 삭제 중 오류 발생:", error);
      }
    }
  };

  return (
    <Container className="p-0 relative overflow-x-scroll">
      <div className="p-3 md:p-5">
        <h1 className="text-[24px] font-bold mb-6">회원관리</h1>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => k && setActiveTab(k)}
          className="mb-4"
          style={{ paddingLeft: "50px" }}
        >
          <Tab eventKey="users" title="사용자 관리">
            <div className="bg-white rounded-lg min-w-[1200px]">
              <div className="p-3 md:p-6 ">
                <h2 className="text-[16px] font-semibold mb-4 ">
                  가입인원: {users.length}명
                </h2>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-center">ID</th>
                      <th className="py-2 text-center">소셜ID</th>
                      <th className="py-2 text-center">소셜타입</th>
                      <th className="py-2 text-center">직업</th>
                      <th className="py-2 text-center">이메일</th>
                      <th className="py-2 text-center">닉네임</th>
                      <th className="py-2 text-center">역할</th>
                      <th className="py-2 text-center">마지막로그인</th>
                      <th className="py-2 text-center">가입일자</th>
                      <th className="p-2 text-center">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user: User) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-2">{user.id}</td>
                        <td className="py-2">{user.social_id}</td>
                        <td className="py-2">{user.social_type}</td>
                        <td className="py-2">{user.job}</td>
                        <td className="py-2">{user.email}</td>
                        <td className="py-2">{user.nickname}</td>
                        <td className="py-2">{user.role}</td>
                        <td className="py-2">
                          {new Date(user.last_login_at).toLocaleString()}
                        </td>
                        <td className="py-2">
                          {new Date(user.createdAt).toLocaleString()}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="hover:bg-gray-200 text-white font-bold py-1 px-2 rounded"
                          >
                            <img
                              src="/images/trash.png"
                              alt="trash"
                              className="w-4 h-4"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* 빈 행 추가 */}
                    {[...Array(Math.max(0, 10 - currentUsers.length))].map(
                      (_, index) => (
                        <tr
                          key={`empty-${index}`}
                          className="border-b h-[50px]"
                        >
                          <td colSpan={10}>&nbsp;</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* 페이지네이션 */}
            <div className="flex justify-center items-center my-4">
              {/* 이전 버튼 */}
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mx-2 ${
                  currentPage === 1 ? "cursor-default" : "cursor-pointer"
                }`}
                style={{ pointerEvents: currentPage === 1 ? "none" : "auto" }}
              >
                <IoIosArrowBack />
              </button>

              {/* 페이지 번호 */}
              {[...Array(Math.ceil(users.length / usersPerPage))].map(
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 mx-1 rounded-full ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}

              {/* 다음 버튼 */}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage === Math.ceil(users.length / usersPerPage)
                }
                className={`flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mx-2 ${
                  currentPage === Math.ceil(users.length / usersPerPage)
                    ? "cursor-default"
                    : "cursor-pointer"
                }`}
                style={{
                  pointerEvents:
                    currentPage === Math.ceil(users.length / usersPerPage)
                      ? "none"
                      : "auto",
                }}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </Tab>
          <Tab eventKey="statistics" title="가입자 통계">
            <div className="bg-white  rounded-lg">
              <div className="p-3 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-[16px] font-bold text-gray-800 mb-4 sm:mb-0">
                    월별 가입자 통계
                  </h2>
                  <div className="flex items-center">
                    <span
                      className="mr-1 text-gray-600 font-sm"
                      style={{ width: "100px" }}
                    >
                      연도 :
                    </span>
                    <Form.Select
                      id="year-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="w-32 border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded-md text-gray-800 font-semibold"
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}년
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
                <div style={{ width: "100%", height: "400px" }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={monthlySignups}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(value) => `${value}월`}
                        type="number"
                        domain={[0.5, 12.5]}
                        ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tick={{ fill: "#666", fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, "auto"]}
                        allowDataOverflow={false}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tick={{ fill: "#666", fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}명`, "가입자 수"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Bar
                        dataKey="count"
                        fill="#4f46e5"
                        name="가입자 수"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default AdminPage;
