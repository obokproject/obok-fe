import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface ChatKeywordProps {
  roomId: string;
  socket: any;
  onKeywordClick: (keyword: string) => void;
  isHost: boolean; // isHost를 prop으로 받음
}

const ChatKeyword: React.FC<ChatKeywordProps> = ({
  roomId,
  socket,
  onKeywordClick,
  isHost, // isHost를 prop으로 사용
}) => {
  const [keywords, setKeywords] = useState<string[]>([]); // 키워드를 상태로 관리
  const { user } = useAuth(); // 현재 로그인된 사용자 정보 가져오기

  useEffect(() => {
    if (socket) {
      // 서버로부터 키워드 업데이트 이벤트를 수신
      socket.on("keywordUpdate", (updatedKeywords: string[]) => {
        setKeywords((prevKeywords) => {
          // 새로운 키워드를 기존 키워드에 병합하고 중복 제거
          const newKeywords = [...prevKeywords, ...updatedKeywords];
          return Array.from(new Set(newKeywords));
        });
      });

      // 방에 처음 입장할 때 서버로부터 이전 키워드를 수신하는 이벤트
      socket.on("previousKeywords", (previousKeywords: string[]) => {
        setKeywords((prevKeywords) => {
          // 이전 키워드를 기존 키워드에 병합하고 중복 제거
          const newKeywords = [...prevKeywords, ...previousKeywords];
          return Array.from(new Set(newKeywords));
        });
      });
    }

    return () => {
      // 컴포넌트가 언마운트되거나 socket이 변경될 때 이벤트 리스너를 정리
      if (socket) {
        socket.off("keywordUpdate");
        socket.off("previousKeywords");
      }
    };
  }, [socket, roomId]); // socket과 roomId가 변경될 때마다 이 useEffect 실행

  const handleDeleteKeyword = (keyword: string) => {
    if (!user) return;

    // 서버에 키워드 삭제 요청
    socket.emit(
      "deleteKeyword",
      { roomId, keyword, userId: user.id },
      (response: any) => {
        if (response.success) {
          // 삭제 성공 시 클라이언트 상태에서 키워드 제거
          setKeywords((prevKeywords) =>
            prevKeywords.filter((kw) => kw !== keyword)
          );
        } else {
        }
      }
    );
  };

  return (
    <div
      className="w-full h-full border-2 border-[#A6046D] rounded-[20px] overflow-hidden"
      style={{
        backgroundImage: `url('/images/logo_fix2.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-wrap p-2 h-auto w-full overflow-y-auto max-h-[345px]">
        {keywords.length === 0 ? (
          <p> </p>
        ) : (
          keywords.map((keyword, index) => (
            <div
              key={index}
              className="flex items-center mr-2 mb-2 w-fit h-fit max-w-[220px]"
            >
              <span
                className="pl-2 pr-5 py-2 rounded-[30px] text-sm cursor-pointer bg-[#E4606D] text-[#FCF8FC] text-[16px] overflow-hidden max-w-full whitespace-nowrap text-ellipsis relative"
                onClick={() => onKeywordClick(keyword)}
              >
                {keyword}

                {isHost && (
                  <button
                    className="absolute right-2 text-[#FCF8FC] text-sm bg-[#E4606D] ml-2"
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭이 부모의 onClick 이벤트로 전파되지 않게
                      handleDeleteKeyword(keyword);
                    }}
                  >
                    x
                  </button>
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatKeyword;
