import React from "react";

interface ChatKeywordProps {
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
}

const ChatKeyword: React.FC<ChatKeywordProps> = ({
  keywords,
  onKeywordClick,
}) => {
  return (
    <div className="flex flex-wrap">
      {keywords.map((keyword, index) => (
        <span
          key={index}
          className="px-2 py-1 rounded-full mr-2 mb-2 text-sm cursor-pointer bg-gray-200 text-gray-700"
          onClick={() => onKeywordClick(keyword)}
        >
          {keyword}
        </span>
      ))}
    </div>
  );
};

export default ChatKeyword;
