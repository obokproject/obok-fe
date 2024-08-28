import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../components/LoginModal";
import "../../styles/tailwind.css";
import { ArrowUp } from "react-bootstrap-icons";
import { useAuth } from "../../contexts/AuthContext";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import ChatbotButton from "../../components/ChatbotButton";

// 슬라이드 이미지 데이터 (실제 이미지 URL로 교체 필요)
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

  return (
    <>
      <Container fluid className="p-0 ">
        <main className="p-0">
          <section className="py-5 text-center">
            <Container fluid>
              <h1 className="display-6 mb-3">실시간 아이디어 공유 플랫폼</h1>
              <p className="lead mb-4">모두와 함께 하는 브레인스토밍</p>
              <button
                className="flex justify-center items-center col-4 mx-auto rounded-full text-5xl font-bold"
                style={{
                  backgroundColor: "#F2DCEF",
                  width: "328px",
                  height: "80px",
                }}
                onClick={handleStartButton}
              >
                시작하기
              </button>
            </Container>
          </section>

          <section>
            <Container fluid className="relative z-10">
              <div
                className="aspect-w-16 aspect-h-9 shadow-2xl rounded-2xl overflow-hidden"
                style={{
                  maxWidth: "900px",
                  height: "544px",
                  margin: "0 auto",
                  backgroundColor: "lightgray",
                }}
              >
                {/* <iframe
                  src="https://www.youtube.com/embed/BLFF1tla3qc"
                  title="서비스 소개 영상"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe> */}
              </div>
            </Container>
          </section>

          <section className="pt-[116px] text-center">
            <Container fluid>
              <div className="w-full max-w-[579px] mx-auto p-4 flex flex-col items-center gap-4">
                <img
                  className=""
                  src="/images/landing-light.png"
                  alt="아이디어 전구 이미지"
                />
                <div className="p-2 text-center">
                  <p className="text-black text-[26px] font-bold font-['Noto Sans KR'] leading-[39px] mb-4">
                    아이디어가 필요한데 떠오르지 않아 막막했던 경험.
                    <br />
                    한번씩 있지 않나요?
                    <br />
                    그 막막했던 이유가
                    <br />
                    혼자여서는 아니었을까요?
                  </p>
                  <p className="text-black text-3xl font-bold font-['Noto Sans KR'] leading-[45px] mb-4">
                    집단 지성,
                  </p>
                  <p className="text-black text-[26px] font-bold font-['Noto Sans KR'] leading-[39px]">
                    다양한 사람들과 함께 할 때입니다.
                  </p>
                </div>
              </div>

              <div className="h-[524px] px-4 py-8 flex-col justify-start items-center inline-flex">
                <div className="self-stretch p-2 justify-center items-center gap-2.5 inline-flex">
                  <div className="text-center text-[#323232] text-[42px] font-bold font-['Inter'] leading-[63px]">
                    다양한 분야, 다양한 직업의 사람들의
                    <br />
                    생각을 모아보세요!
                  </div>
                </div>
                <div className="p-2 justify-start items-center gap-2.5 inline-flex">
                  <img
                    className="w-[302px] h-[302px]"
                    src="/images/landing-hug.png"
                  />
                </div>
              </div>
            </Container>
          </section>

          {/* 슬라이드 섹션 */}
          <section className="w-full py-[120px] flex flex-col items-center justify-center">
            <Container fluid>
              <div className="relative max-w-4xl mx-auto">
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 -left-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-90  transition duration-300 z-10"
                >
                  <IoIosArrowBack size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 -right-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:scale-90 transition duration-300 z-10"
                >
                  <IoIosArrowForward size={24} />
                </button>
                <div className="overflow-hidden rounded-lg shadow-2xl max-w-3xl mx-auto">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`${
                        index === current ? "block" : "hidden"
                      } transition-opacity duration-500`}
                    >
                      <div className="mt-4 text-center">
                        <h3 className="text-center text-[#323232] text-4xl font-bold font-['Noto Sans KR'] leading-[54px]">
                          {slide.title}
                        </h3>
                        <p className="text-center text-[#848484] text-base font-normal font-['Noto Sans KR'] leading-normal">
                          {slide.description}
                        </p>
                      </div>
                      <div className="rounded-lg shadow-2xl overflow-hidden">
                        <img
                          src={slide.url}
                          alt={slide.alt}
                          className="w-[800px] h-[440px] object-cover" //크기 고정 및 cover로 이미지 비율 유지
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="table p-4 justify-center gap-4 inline-flex mt-[60px]">
                  <ul className="dots flex justify-center">
                    {slides.map((_, index) => (
                      <li
                        key={index}
                        className={`w-3 h-3 rounded-full mx-2 cursor-pointer transition-all duration-300 ${
                          index === current ? "bg-blue-500" : "bg-gray-300"
                        }`}
                        onClick={() => setCurrent(index)}
                      ></li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
            <ChatbotButton />
          </section>
        </main>

        {/* 스크롤버튼 */}
        {showScrollTopButton && (
          <button
            onClick={scrollTop}
            className="scroll-top-button fixed sm:right-8 md:right-12 lg:right-20"
            style={{
              backgroundColor: "#ffb561",
              bottom: "180px",
              right: "20px",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
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
      </Container>
    </>
  );
};

export default LandingPage;
