import React from "react";

const AboutPage: React.FC = () => {
  const coreValues = [
    {
      title: "Human-Centric Connection",
      description1:
        "사람 중심의 연결을 통해 모든 서비스와 상호작용이 인간의 가치와 경험을 우선으로 한다.",
      description2:
        "Prioritizing human values and experiences in all interactions and services.",
    },
    {
      title: "Idea Exchange",
      description1:
        "열린 아이디어 교환을 통해 창의성과 혁신을 촉진하며, 다양한 관점을 존중한다.",
      description2:
        "Fostering creativity and innovation through open idea sharing while respecting diverse perspectives.",
    },
    {
      title: "Collaborative Growth",
      description1:
        "협력을 통해 함께 성장하고 발전하며, 개인과 조직의 성장을 동시에 추구한다.",
      description2:
        "Pursuing growth and development together through collaboration, focusing on both individual and  organizational advancement.",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mt-10 mb-12 flex flex-row items-center">
          <img src="/images/lightbulb.png" alt="전구" />
          베리 소개
        </h1>
        <h1 className="text-3xl font-bold mb-12">About Razvery</h1>

        <div className="grid md:grid-cols-2 gap-6 items-center mb-8 border-t-4">
          <div className=" space-y-6">
            <p className=" text-[20px] text-gray-700 leading-relaxed">
              라즈베리는 사람과 사람 사이의 의미 있는 연결을 추구하고 새로운
              아이디어, 다양한 관점의 교류를 통해 긍정적인 사회 변화를
              추구합니다.
              <br />
              <br />
              사람들이 더 쉽게 연결되고, 아이디어를 나누며, 함께 성장할 수 있는
              혁신적인 기술 솔루션을 개발하고 있습니다.
            </p>
          </div>

          <div className="m-16 relative w-[468px] h-[280px] rounded-lg overflow-hidden shadow-xl">
            <img
              src="/images/aboutus1.webp"
              alt="Razvery Vision"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white text-center">
                Connecting People
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-[20px] text-gray-700 leading-relaxed">
              라즈베리의 목표는 단순한 기술 개발을 넘어, 사회적 가치를 창출하고
              인류의 지적, 정서적 성장에 기여하는 것입니다.
              <br />
              <br />
              혁신적인 플랫폼을 통해 다양한 생각을 나누고 사고를 넓히는데 도움을
              주는 기술을 연구하고 있습니다.
            </p>
          </div>

          <div className="m-16 relative w-[468px] h-[280px] rounded-lg overflow-hidden shadow-xl">
            <img
              src="/images/aboutus2.webp"
              alt="Expanding Minds"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white text-center">
                Expanding Minds
              </h2>
            </div>
          </div>
        </div>

        <div className="mt-16 mb-20">
          <h2 className="text-3xl font-semibold mb-[30px] ">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-md border overflow-hidden"
              >
                <div className="h-[60px]">
                  <h3
                    className="text-xl w-full h-full rounded-t-3xl font-semibold flex justify-center items-center"
                    style={{ backgroundColor: "#ffb561" }}
                  >
                    {value.title}
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-gray-700 text-lg">{value.description1}</p>
                  <p className="text-gray-600">{value.description2}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
