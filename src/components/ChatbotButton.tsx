import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Question } from "react-bootstrap-icons";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setMessages([...messages, { text: option, sender: "user" }]);

    let response: string;
    switch (option) {
      case "라즈베리란?":
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
          "탈퇴를 원하시나요? 탈퇴 전 주의사항을 확인해 주시고, 그래도 탈퇴를 원하시면 인스타그램을 통해 문의해 주세요! 신속히 처리해드리겠습니다^^";
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
    setSelectedOption(null);
  };

  return (
    <div className="fixed right-4 bottom-[15rem] z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="hover:bg-gray-200 text-black rounded-full p-3 shadow-lg"
          style={{ backgroundColor: "#ffb561" }}
        >
          <Question size={32} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[28rem] flex flex-col">
          <div className="bg-[#f2dcef] p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">문의하기!</h3>

            <button
              onClick={toggleChat}
              className="hover:text-md p-1 rounded-full transition-colors duration-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1  p-4">
            <div className="col-span-2 mb-2">
              안녕하세요? 라즈베리입니다!
              <br />
              무엇이 궁금하신가요~?^^
            </div>
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
            {!selectedOption ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOptionClick("라즈베리란?")}
                  className="bg-gray-200 hover:bg-gray-300 rounded p-2"
                >
                  라즈베리란?
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
              <button
                onClick={handleReset}
                className="w-full bg-gray-200 hover:bg-gray-300 rounded p-2 flex items-center justify-center"
              >
                <ArrowLeft size={20} className="mr-2" />
                처음으로 돌아가기
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatbotButton;
