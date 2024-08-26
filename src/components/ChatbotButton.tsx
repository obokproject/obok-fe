import React, { useState } from "react";
import { LucideClover, X, ArrowLeft } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    setMessages([...messages, { text: option, sender: "user" }]);

    let response: string;
    switch (option) {
      case "Razvery란?":
        response = "실시간 생각 공유 플랫폼입니다.";
        break;
      case "이용문의":
        response =
          " 베리톡(브레인스토밍 채팅)과 베리보드(아이디어 보드)가 있습니다.";
        break;
      case "상담문의":
        response =
          "저희 플랫폼 Razvery에 대해 더 궁금하신가요? 가입하시면 저희가 준비한 많은 기술들을 만나실 수 있습니다.";
        break;
      case "탈퇴문의":
        response =
          "탈퇴를 원하시나요? 탈퇴 전 주의사항을 확인해 주세요. 추가 문의사항이 있으면 아래 인스타그램으로 메시지 주세요.";
        break;
      default:
        response = "죄송합니다. 해당 옵션에 대한 정보가 없습니다.";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
    }, 500);
  };

  const handleReset = () => {
    setMessages([]);
  };

  return (
    <div className="fixed right-4 bottom-[15rem] z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-yellow-200 hover:bg-gray-200 text-black rounded-lg p-3 shadow-lg"
        >
          <LucideClover size={32} />
          <span className="ml-2 font-bold">무엇이 궁금하신가요?</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[25rem] flex flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">문의하기!</h3>
            <button
              onClick={toggleChat}
              className="hover:bg-blue-600 p-1 rounded-full transition-colors duration-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === "user" ? "bg-blue-100" : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            {messages.length === 0 ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOptionClick("Razvery란?")}
                  className="bg-gray-200 hover:bg-gray-300 rounded p-2"
                >
                  Razvery란?
                </button>
                <button
                  onClick={() => handleOptionClick("이용문의")}
                  className="bg-gray-200 hover:bg-gray-300 rounded p-2"
                >
                  이용문의
                </button>
                <button
                  onClick={() => handleOptionClick("상담문의")}
                  className="bg-gray-200 hover:bg-gray-300 rounded p-2"
                >
                  상담문의
                </button>
                <button
                  onClick={() => handleOptionClick("탈퇴문의")}
                  className="bg-gray-200 hover:bg-gray-300 rounded p-2"
                >
                  탈퇴문의
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-200 hover:bg-gray-300 rounded p-2 flex items-center justify-center"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  처음으로 돌아가기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotButton;
