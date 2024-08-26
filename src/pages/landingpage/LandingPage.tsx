import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../../components/LoginModal";
import "../../styles/tailwind.css";
import { ArrowUp } from "react-bootstrap-icons";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import ChatbotButton from "../../components/ChatbotButton";

// 슬라이드 이미지 데이터 (실제 이미지 URL로 교체 필요)
const slides = [
  { url: "https://picsum.photos/800/440", alt: "Image 1" },
  { url: "https://picsum.photos/800/441", alt: "Image 2" },
  { url: "https://picsum.photos/800/442", alt: "Image 3" },
  { url: "https://picsum.photos/800/443", alt: "Image 4" },
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
      <Container fluid className="p-0">
        <main>
          <section className="py-5 text-center bg-light">
            <Container>
              <h1 className="display-6 mb-3">
                아이디어를 현실로 바꾸는 실시간 협업 플랫폼
              </h1>
              <p className="lead mb-4">모두와 함께 하는 브레인스토밍</p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartButton}
                className="d-grid gap-2 col-4 mx-auto"
              >
                시작하기
              </Button>
            </Container>
          </section>

          <section className="py-5 bg-gray-100 ">
            <Container>
              <div
                className="aspect-w-16 aspect-h-9 shadow-2xl rounded-lg overflow-hidde"
                style={{ maxWidth: "900px", height: "544px", margin: "0 auto" }}
              >
                <iframe
                  src="https://www.youtube.com/embed/BLFF1tla3qc"
                  title="서비스 소개 영상"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </Container>
          </section>

          <section className="py-5  bg-red-100 text-center">
            <Container>
              <h2 className="text-3xl font-bold mb-8">문제 해결</h2>
              <p className="mb-4">아이디어가 필요한데</p>
              <p className="mb-4">떠오르지 않아서 막막했던 경험.</p>
              <p className="mb-4">한번씩 있지 않나요?</p>
              &nbsp;
              <p className="mb-4">그 막막했던 이유가</p>
              <p>혼자여서는 아니었을까요?</p>
              <div className="flex justify-content-center  mb-10 ">
                <img
                  src="https://picsum.photos/448"
                  className="w-448 rounded-lg shadow-xl mx-auto"
                />
              </div>
              <p className="mb-4">Collective Intelligence</p>
              <p className="mb-4">집단 지성</p>
              <p className="mb-4">이제,</p>
              <div className="flex text-center justify-center">
                <p className="text-2xl">다양한 </p>
                <p> 사람들과 함께 할 때입니다.</p>
              </div>
              <Link to="/about" className="btn btn-outline-primary mt-5">
                자세히 알아보기
              </Link>
            </Container>
          </section>

          <section className="py-5 mb-10">
            <Container>
              <h2 className="flex justify-content-center after:"> 베리톡 </h2>
              <p className="text-center  mb-12">
                실시간 대화를 통해서 유저간 의견을 자유롭게 공유할수 있는 채팅방
              </p>
              <div className="relative max-w-4xl mx-auto">
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 -left-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-90  transition duration-300 z-10"
                >
                  <IoIosArrowBack size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 -right-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-90 transition duration-300 z-10"
                >
                  <IoIosArrowForward size={24} />
                </button>
                <div className="overflow-hidden rounded-lg shadow-2xl">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`${
                        index === current ? "block" : "hidden"
                      } transition-opacity duration-500`}
                    >
                      <img
                        src={slide.url}
                        alt={slide.alt}
                        className="w-full h-auto shadow-xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Container>
            <ChatbotButton />
          </section>
        </main>

        {showScrollTopButton && (
          <Button
            variant="primary"
            onClick={scrollTop}
            className="scroll-top-button"
            style={{
              position: "fixed",
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
          </Button>
        )}
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
