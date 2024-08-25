import React, { useEffect, useState } from "react";

interface ChatKeywordProps {
  roomId: string;
  socket: any;
  onKeywordClick: (keyword: string) => void;
}

const ChatKeyword: React.FC<ChatKeywordProps> = ({
  roomId,
  socket,
  onKeywordClick,
}) => {
  const [keywords, setKeywords] = useState<string[]>([]); // 키워드를 상태로 관리

  useEffect(() => {
    if (socket) {
      // 서버로부터 키워드 업데이트 이벤트를 수신
      socket.on("keywordUpdate", (updatedKeywords: string[]) => {
        console.log("Received updated keywords:", updatedKeywords);

        setKeywords((prevKeywords) => {
          // 새로운 키워드를 기존 키워드에 병합하고 중복 제거
          const newKeywords = [...prevKeywords, ...updatedKeywords];
          return Array.from(new Set(newKeywords));
        });
      });

      // 방에 처음 입장할 때 서버로부터 이전 키워드를 수신하는 이벤트
      socket.on("previousKeywords", (previousKeywords: string[]) => {
        console.log("Received previous keywords:", previousKeywords);

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

  return (
    <div className="flex flex-wrap">
      {keywords.length === 0 ? (
        <p>No keywords available</p>
      ) : (
        keywords.map((keyword, index) => (
          <span
            key={index}
            className="px-2 py-1 rounded-full mr-2 mb-2 text-sm cursor-pointer bg-gray-200 text-gray-700"
            onClick={() => onKeywordClick(keyword)}
          >
            {keyword}
          </span>
        ))
      )}
    </div>
  );
};

export default ChatKeyword;
