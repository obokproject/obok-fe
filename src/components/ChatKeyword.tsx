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
  const [keywords, setKeywords] = useState<string[]>([]); // 상태로 관리

  useEffect(() => {
    if (socket) {
      socket.on("keywordUpdate", (updatedKeywords: string[]) => {
        console.log("Received updated keywords:", updatedKeywords);
        setKeywords((prevKeywords) => {
          // 중복을 제거하고 기존 키워드에 새 키워드를 병합
          const newKeywords = [...prevKeywords, ...updatedKeywords];
          return Array.from(new Set(newKeywords)); // Set을 사용해 중복 제거
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("keywordUpdate");
      }
    };
  }, [socket, roomId]);

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
