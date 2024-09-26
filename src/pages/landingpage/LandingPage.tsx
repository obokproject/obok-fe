import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../components/LoginModal";
import "../../styles/tailwind.css";
import { ArrowUp } from "react-bootstrap-icons";
import { useAuth } from "../../contexts/AuthContext";
import { BsCaretLeft, BsCaretRight } from "react-icons/bs";
import ChatbotButton from "../../components/ChatbotButton";

// 슬라이드 이미지 데이터
const slides = [
  {
    url: "/images/landing-veryfind.png",
    alt: "Image 1",
    title: "생각열매 찾기",
    description:
      "관심있거나 좋아하는 주제를 찾아, 원하는 프로젝트를 탐색해 보세요!",
  },
  {
    url: "/images/landing-verytalk.png",
    alt: "Image 2",
    title: "베리톡",
    description:
      "실시간 대화를 통해서 유저간 자유롭게 아이디어의 날개를 펼쳐보세요.",
  },
  {
    url: "/images/landing-veryboard.png",
    alt: "Image 3",
    title: "베리보드",
    description: "직관적인 보드로 아이디어를 체계적으로 관리해보세요.",
  },
  {
    url: "/images/landing-verymap.png",
    alt: "Image 4",
    title: "베리맵(추후공개)",
    description: "창의력을 시각화하여 생각의 흐름을 자유롭게 확장하세요.",
  },
];

const LandingPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const { isLoggedIn, loginWithGoogle } = useAuth();
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const navigate = useNavigate();

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  // 이미지 슬라이드
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  // 스크롤 버튼 표시 로직
  useEffect(() => {
    const checkScrollTop = () => {
      setShowScrollTopButton(window.pageYOffset > window.innerHeight / 2);
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartButton = () => {
    isLoggedIn ? navigate("/main") : openLoginModal();
  };

  // 슬라이드 자동재생
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((current) => (current === length - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [length]);

  return (
    <>
      <div className="p-0">
        <main className="p-0">
          {/* 첫 번째 섹션 */}
          <section className="py-20 text-center px-4">
            <div className="max-w-4xl mx-auto">
              <h1
                className="display-6 mb-3"
                style={{
                  fontWeight: 700,
                  fontSize: "34px",
                  wordWrap: "break-word",
                }}
              >
                실시간 아이디어 공유 플랫폼
              </h1>
              <p
                className="lead mb-4"
                style={{
                  fontWeight: 400,
                  fontSize: "24px",
                  wordWrap: "break-word",
                }}
              >
                모두와 함께 하는 브레인스토밍
              </p>
              <div className="w-full h-full p-4 bg-white inline-flex justify-center items-center">
                <button
                  className="h-20 bg-[#F2DCEF] rounded-full flex justify-center items-center hover:bg-[rgb(251,182,182)] transform transition-color duration-300 text-[#323232] text-5xl font-bold leading-[72px] px-5"
                  onClick={handleStartButton}
                >
                  시작하기
                </button>
              </div>
            </div>
          </section>

          {/* 슬라이드 섹션 */}
          <section className="pt-10 pb-20 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative mx-auto">
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-white p-2 rounded-full hover:scale-90  transition duration-300 z-10"
                >
                  <BsCaretLeft size={30} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white p-2 rounded-full  hover:scale-90 transition duration-300 z-10"
                >
                  <BsCaretRight size={30} />
                </button>
                <div
                  className="overflow-hidden rounded-[16px] max-w-3xl mx-auto"
                  style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.20)" }}
                >
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`${
                        index === current ? "block" : "hidden"
                      } transition-opacity duration-500`}
                    >
                      <div className="mt-4 text-center">
                        <h3 className="text-4xl font-bold text-[#323232] mb-2">
                          {slide.title}
                        </h3>
                        <p className="text-base text-[#848484] mb-4">
                          {slide.description}
                        </p>
                      </div>
                      <div className=" shadow-2xl  overflow-hidden">
                        <img
                          src={slide.url}
                          alt={slide.alt}
                          className="w-full h-[440px] object-cover" //크기 고정 및 cover로 이미지 비율 유지
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-20">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      className={`w-4 h-4 rounded-full mx-2 transition-all duration-300 ${
                        index === current ? "bg-gray-500" : "bg-gray-300"
                      }`}
                      onClick={() => setCurrent(index)}
                    ></button> // 캐러셀
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 아이디어 전구 섹션 */}
          <section className="py-15 px-4">
            <div className="mx-auto text-center max-w-4xl">
              <div className="mx-auto text-center w-full max-w-[800px]">
                <img
                  className="mx-auto mb-8"
                  src="/images/landing-light.png"
                  alt="lightimage"
                />
                <div className="p-2 text-center">
                  <p className="text-2xl font-bold mb-8 break-words">
                    아이디어가 필요한데 떠오르지 않아 막막했던 경험.
                    <br />
                    한번씩 있지 않나요?
                    <br />
                    그 막막했던 이유가
                    <br />
                    혼자여서는 아니었을까요?
                  </p>
                  <p className="text-3xl font-bold ">집단 지성,</p>
                  <p className="text-2xl font-bold">
                    다양한 사람들과 함께 할 때입니다.
                  </p>
                </div>

                <div className="py-24 text-center">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center text-[#323232] text-[42px] font-bold leading-[63px] mb-12 break-words">
                      다양한 분야, 다양한 직업의 사람들의
                      <br />
                      생각을 모아보세요!
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <img
                      className="w-[302px] h-[302px]"
                      src="/images/landing-hug.png"
                      alt="hug"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* <section className="pb-40">
            <div className="relative mb-10 z-10 w-full max-w-4xl mx-auto">
              <div className="w-[800px] h-[440px] bg-[#DEE2E6] rounded-2xl overflow-hidden mx-auto">
                <iframe
                  src="https://www.youtube.com/embed/j99-3IPLEfs"
                  title="intro video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </section> */}
        </main>

        {/* 스크롤버튼 */}
        {showScrollTopButton && (
          <button
            onClick={scrollTop}
            className="fixed right-6 bottom-[10rem] sm:right-8 bg-[#ffb561] rounded-full w-[50px] h-[50px] flex justify-center items-center z-50"
          >
            <ArrowUp size={24} />
          </button>
        )}

        {/* 로그인모달 */}
        <LoginModal
          isOpen={showLoginModal}
          closeModal={closeLoginModal}
          loginWithGoogle={loginWithGoogle}
        />
        <ChatbotButton />
      </div>
    </>
  );
};

export default LandingPage;
