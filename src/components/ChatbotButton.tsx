import React, { useState } from "react";
import { X, ArrowLeft, BotMessageSquare } from "lucide-react";

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
        response =
          "창의적인 아이디어와 다양한 의견을 모두가 함께하는 브레인스토밍 플랫폼입니다 🙂";
        break;
      case "이용문의":
        response =
          "베리톡(채팅)과 베리보드(칸반)가 있으며, 톡은 해시태그기능이 있고, 보드는 아이디어를 작성하고 정리가 가능합니다^^";
        break;
      case "상담문의":
        response =
          "저희 플랫폼 Razvery에 대해 더 궁금하신가요? 가입하시면 저희가 준비한 많은 솔루션들을 만나실 수 있습니다. 자세한 문의는 인스타그램을 통해 문의주세요^^";
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
    <div className="fixed right-[2rem] bottom-[15rem] z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="hover:bg-gray-200 text-black rounded-full p-3 shadow-lg"
          style={{ backgroundColor: "#ffb561" }}
        >
          <BotMessageSquare size={22} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-[16px] shadow-xl w-96 h-[28rem] flex flex-col overflow-hidden">
          <div className="bg-[#ffb561] p-4 flex justify-between items-center h-[64px]">
            <h3 className="font-bold mt-2">문의하기</h3>

            <button
              onClick={toggleChat}
              className="hover:text-md p-1 rounded-full transition-colors duration-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 p-4">
            <div
              className="col-span-2 p-2 rounded-2xl text-[16px] w-[208px]"
              style={{ backgroundColor: "#E5E7EB" }}
            >
              안녕하세요. 라즈베리입니다.
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
                  className={`inline-block p-2 px-3 rounded-[20px] text-[#323232] ${
                    msg.sender === "user" ? "bg-blue-100" : "bg-gray-200 mr-10"
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
                  className="bg-gray-200 hover:bg-gray-300 rounded-[30px] p-2 text-lg"
                >
                  라즈베리란?
                </button>
                <button
                  onClick={() => handleOptionClick("이용문의")}
                  className="bg-gray-200 hover:bg-gray-300 rounded-[30px] p-2 text-lg"
                >
                  이용문의
                </button>
                <button
                  onClick={() => handleOptionClick("상담문의")}
                  className="bg-gray-200 hover:bg-gray-300 rounded-[30px] p-2 text-lg"
                >
                  상담문의
                </button>
                <button
                  onClick={() => handleOptionClick("탈퇴문의")}
                  className="bg-gray-200 hover:bg-gray-300 rounded-[30px] p-2"
                >
                  탈퇴문의
                </button>
              </div>
            ) : (
              <button
                onClick={handleReset}
                className="w-full bg-gray-200 hover:bg-gray-300 rounded-[30px] p-2 text-[18px] flex items-center justify-center"
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
