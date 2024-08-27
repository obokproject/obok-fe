import React, { useState } from "react";
import { Modal, ButtonGroup } from "react-bootstrap";

interface CreateRoomModalProps {
  show: boolean;
  onHide: () => void;
  onCreate: (roomData: any) => void; // onCreate 함수가 방 생성 후 호출됩니다.
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  show,
  onHide,
  onCreate,
}) => {
  const [roomType, setRoomType] = useState<"chat" | "kanban">("chat");
  const [title, setTitle] = useState(""); // topic을 title로 변경
  const [maxMember, setMaxMember] = useState(4); // participants를 maxMember로 변경
  const [duration, setDuration] = useState(10); // 기본 제한 시간 변경
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");

  // 방 생성 핸들러 함수
  const handleCreate = () => {
    onCreate({
      type: roomType,
      title, // title로 전달
      max_member: maxMember, // max_member로 전달
      duration,
      keywords,
    });
    onHide();
  };

  // 키워드 추가 함수
  const addKeyword = () => {
    if (
      currentKeyword &&
      keywords.length < 3 &&
      !keywords.includes(currentKeyword)
    ) {
      setKeywords([...keywords, currentKeyword]);
      setCurrentKeyword("");
    }
  };

  // 스페이스바로 키워드 추가
  const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && currentKeyword.trim() && keywords.length < 3) {
      addKeyword();
    }
  };

  // 키워드 제거 함수
  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        show ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-[960px]">
        <div className="border-b border-gray-300 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold w-100 text-center">
            프로젝트 만들기
          </h2>
          <button
            onClick={onHide}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg space-y-4">
          {/* 베리톡 / 베리보드 선택 버튼 */}
          <div className="flex justify-center mb-4">
            <button
              className={`py-2 px-4 rounded-l-full ${
                roomType === "chat"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              onClick={() => setRoomType("chat")}
            >
              베리톡
            </button>
            <div className="w-2"></div> {/* 두 버튼 사이 간격 조절 */}
            <button
              className={`py-2 px-4 rounded-r-full ${
                roomType === "kanban"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              onClick={() => setRoomType("kanban")}
            >
              베리보드
            </button>
          </div>

          <form className="space-y-4">
            {/* 주제 입력 필드 */}
            <div className="flex items-center bg-white p-4 rounded-md shadow-sm">
              <label className="w-20 text-gray-500">주제</label>
              <input
                type="text"
                placeholder="공유하고 싶은 주제를 정해보세요(20자)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={20}
                className="flex-grow bg-gray-100 text-gray-700 p-2 rounded-md outline-none"
              />
            </div>

            {/* 인원 및 제한시간 설정 */}
            <div className="flex items-center bg-white p-4 rounded-md shadow-sm">
              <label className="w-20 text-gray-500">인원</label>
              <input
                type="number"
                min={2}
                max={10}
                value={maxMember}
                onChange={(e) => setMaxMember(Number(e.target.value))}
                className="flex-grow bg-gray-100 text-gray-700 p-2 rounded-md outline-none appearance-none"
                onKeyDown={(e) => e.preventDefault()} // 입력 차단
              />
              <label className="w-28 text-gray-500 ml-4">제한시간 (분)</label>
              <input
                type="number"
                min={5}
                max={20}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="flex-grow bg-gray-100 text-gray-700 p-2 rounded-md outline-none appearance-none"
                onKeyDown={(e) => e.preventDefault()} // 입력 차단
              />
            </div>

            {/* 키워드 입력 필드 */}
            <div className="flex items-center bg-white p-4 rounded-md shadow-sm">
              <label className="w-20 text-gray-500">키워드</label>
              <input
                type="text"
                placeholder="#키워드 입력 (2-8자, 최대 3개)"
                value={currentKeyword}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const filteredValue = inputValue.replace(
                    /[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ]/g,
                    ""
                  );
                  setCurrentKeyword(filteredValue);
                }}
                maxLength={8}
                className="flex-grow bg-gray-100 text-gray-700 p-2 rounded-md outline-none"
                onKeyPress={handleKeywordInput}
              />
            </div>

            {/* 추가된 키워드 목록 */}
            <div className="mt-2 flex flex-wrap">
              {keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 text-gray-700 p-1 m-1 rounded-full"
                >
                  <span className="mr-2">#{keyword}</span>
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="text-gray-500 hover:text-gray-800 text-sm px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </form>
        </div>
        <div className="border-t border-gray-300 p-4 flex justify-center">
          {/* 취소 및 만들기 버튼 */}
          <button
            onClick={onHide}
            className="py-2 px-6 rounded-full bg-gray-200 text-gray-700 mr-2"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            className="py-2 px-6 rounded-full bg-orange-400 text-white"
          >
            만들기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
