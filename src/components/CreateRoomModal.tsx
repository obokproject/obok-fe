import React, { useState } from "react";

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

  // 유효성 검사 상태
  const [titleError, setTitleError] = useState(false);
  const [keywordError, setKeywordError] = useState(false);

  // 방 생성 핸들러 함수
  const handleCreate = () => {
    // 유효성 검사
    let isValid = true;

    // 제목 유효성 검사
    if (title.length < 2 || title.length > 20) {
      setTitleError(true);
      isValid = false;
    } else {
      setTitleError(false);
    }

    // 키워드 유효성 검사
    const invalidKeyword = keywords.some(
      (keyword) => keyword.length < 2 || keyword.length > 6
    );

    if (
      invalidKeyword ||
      (currentKeyword.length > 0 &&
        (currentKeyword.length < 2 || currentKeyword.length > 6))
    ) {
      setKeywordError(true);
      isValid = false;
    } else {
      setKeywordError(false);
    }

    // 유효성 검사를 통과한 경우에만 방 생성
    if (isValid) {
      onCreate({
        type: roomType,
        title, // title로 전달
        max_member: maxMember, // max_member로 전달
        duration,
        keywords,
      });
      onHide();
    }
  };

  // 키워드 추가 함수
  const addKeyword = () => {
    if (
      currentKeyword &&
      keywords.length < 3 &&
      !keywords.includes(currentKeyword) &&
      currentKeyword.length >= 1 && // 최소 2자
      currentKeyword.length <= 6 // 최대 6자
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
      <div className="bg-white rounded-[40px] shadow-lg w-[960px] h-[700px] pt-[40px] pb-[40px] flex flex-col items-center">
        <div className="w-full h-fit border-b-[1px] border-[#323232] flex flex-col items-center">
          <div className="text-[42px] font-[500px] w-[300px] h-[115px] pt-[10px] pb-[42px] flex text-center">
            프로젝트 만들기
          </div>
        </div>
        <div className="bg-white rounded-lg mt-[32px] mb-[32px] ml-[160px] mr-[160px] flex flex-col items-start w-[640px] h-[368px] gap-[24px]">
          {/* 베리톡 / 베리보드 선택 버튼 */}
          <div className="flex">
            <button
              className={`rounded-[40px] ${
                roomType === "chat"
                  ? "bg-black text-white"
                  : "bg-[#E9ECEF] text-[#323232]"
              }`}
              onClick={() => setRoomType("chat")}
            >
              <div className="flex items-center justify-center w-[180px] h-[52px] p-0 gap-2 text-[28px] font-[500]">
                <img
                  src={
                    roomType === "chat"
                      ? "/images/Vector2.png"
                      : "/images/Vector.png"
                  }
                  alt="Vector"
                  className="w-[40px] h-[40px]"
                />
                <div
                  className={`${
                    roomType === "chat"
                      ? "bg-black text-white"
                      : "bg-[#E9ECEF] text-[#323232]"
                  }`}
                >
                  베리톡
                </div>
              </div>
            </button>
            <div className="w-4"></div> {/* 두 버튼 사이 간격 조절 */}
            <button
              className={` rounded-[40px] ${
                roomType === "kanban"
                  ? "bg-black text-white"
                  : "bg-[#E9ECEF] text-[#323232]"
              }`}
              onClick={() => setRoomType("kanban")}
            >
              <div className="flex items-center justify-center w-[184px] p-0 gap-2 text-[28px] font-[500]">
                <img
                  src={
                    roomType === "kanban"
                      ? "/images/layout-kanban2.png"
                      : "/images/layout-kanban.png"
                  }
                  alt="layout-kanban"
                  className="w-[40px] h-[40px]"
                />
                <div
                  className={`${
                    roomType === "kanban"
                      ? "bg-black text-white"
                      : "bg-[#E9ECEF] text-[#323232]"
                  }`}
                >
                  베리보드
                </div>
              </div>
            </button>
          </div>

          {/* 주제 입력 필드 */}
          <div
            className={`flex items-center bg-[#E9ECEF] w-full h-[52px] pt-2 pb-2 rounded-[30px] text-[24px] font-[500] ${
              titleError ? "border-2 border-red-500" : ""
            }`}
          >
            <div className="w-[142px] pt-2 pb-2 pr-6 pl-6 text-[#323232] text-center border-r-[3px] border-[#6C757D]">
              주제
            </div>
            <div className="w-full pt-2 pb-2 pr-6 pl-6">
              <input
                type="text"
                placeholder="공유하고 싶은 주제를 정해보세요(2-20자)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-grow bg-[#E9ECEF] text-[#323232] rounded-md outline-none w-full"
              />
            </div>
          </div>

          {/* 인원 및 제한시간 설정 */}
          <div className="flex items-center w-full h-[52px] pt-2 pb-2 text-[24px] font-[500]">
            <div className="w-[123px] pt-2 pb-2 pr-6 pl-6 text-[#323232] text-center border-r-[3px] border-[#6C757D] bg-[#E9ECEF] rounded-l-[30px]">
              인원
            </div>
            <div className="w-[120px] pt-2 pb-2 pl-6 text-[#323232] text-center rounded-r-[30px] bg-[#E9ECEF] border-[#6C757D]">
              <input
                type="number"
                min={2}
                max={10}
                value={maxMember}
                onChange={(e) => setMaxMember(Number(e.target.value))}
                className="flex-grow w-[50px] bg-[#E9ECEF] text-[#323232] rounded-md outline-none appearance-none"
                onKeyDown={(e) => e.preventDefault()} // 입력 차단
                style={{
                  MozAppearance: "textfield", // Firefox에서 기본 숫자 입력 스타일 제거
                  WebkitAppearance: "textfield", // Chrome, Safari에서 기본 숫자 입력 스타일 제거
                  appearance: "textfield", // 기본 숫자 입력 스타일 제거
                  position: "relative",
                }}
              />
            </div>

            <div className="w-[123px] pt-2 pb-2 pr-3 pl-3 text-[#323232] text-center border-r-[3px] border-[#6C757D] bg-[#E9ECEF] ml-[80px] rounded-l-[30px]">
              제한시간
            </div>
            <div className="w-[120px] pt-2 pb-2 pl-6 text-[#323232] text-center rounded-r-[30px] bg-[#E9ECEF] border-[#6C757D]">
              <input
                type="number"
                min={5}
                max={20}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="flex-grow w-[50px] bg-[#E9ECEF] text-[#323232] rounded-md outline-none appearance-none"
                onKeyDown={(e) => e.preventDefault()} // 입력 차단
              />
            </div>
          </div>

          {/* 키워드 입력 필드 */}
          <div
            className={`flex items-center bg-[#E9ECEF] w-full h-[52px] pt-2 pb-2 rounded-[30px] text-[24px] font-[500] ${
              keywordError ? "border-2 border-red-500" : ""
            }`}
          >
            <div className="w-[142px] pt-2 pb-2 pr-6 pl-6 text-[#323232] text-center border-r-[3px] border-[#6C757D]">
              키워드
            </div>
            <div className="w-full pt-2 pb-2 pr-6 pl-6">
              <input
                type="text"
                placeholder="#최대3개#최대6자#스페이스로확정"
                value={currentKeyword}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const filteredValue = inputValue.replace(
                    /[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ0-9]/g,
                    ""
                  );

                  setCurrentKeyword(filteredValue);
                }}
                className="flex-grow bg-[#E9ECEF] text-[#323232] rounded-md outline-none w-full"
                onKeyPress={handleKeywordInput}
              />
            </div>
          </div>

          {/* 추가된 키워드 목록 */}
          <div className="flex items-center w-full h-[52px] pt-2 pb-2 rounded-[30px] text-[24px] font-[500] gap-2">
            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center bg-[#E9ECEF] text-[#323232] pt-[8px] pb-[8px] pr-[8px] pl-[16px] rounded-[30px]"
              >
                <span>#{keyword}</span>
                <button onClick={() => removeKeyword(keyword)} className="">
                  <div className="flex w-[47px] p-2 justify-center items-center">
                    <img
                      src="/images/x-lg.png"
                      alt="x-lg"
                      className="w-[17px] h-[17x]"
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 pt-0 flex justify-center">
          {/* 취소 및 만들기 버튼 */}
          <button
            onClick={onHide}
            className="p-[10px] mr-4 rounded-[40px] bg-[#E2E2E2] text-[#323232] w-[232px] h-[74px] text-center text-[36px]"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            className="p-[10px] mr-4 rounded-[40px]  bg-[#FFB662] text-[#323232] w-[232px] h-[74px] text-center text-[36px]"
          >
            만들기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
