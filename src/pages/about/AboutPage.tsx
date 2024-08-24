import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-l from-yellow-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-red-400 mb-12">
          About Razvery
        </h1>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Razvery는 사람과 사람 사이의 의미 있는 연결을 추구하고 새로운
              아이디어, 다양한 관점의 교류를 통해 긍정적인 사회 변화를
              추구합니다.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              그래서 사람들이 더 쉽게 연결되고, 아이디어를 나누며, 함께 성장할
              수 있는 혁신적인 기술 솔루션을 개발하고 있습니다.
            </p>
          </div>

          <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
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
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative h-80 rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
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

          <div className="space-y-6 order-1 md:order-2">
            <p className="text-lg text-gray-700 leading-relaxed">
              Razvery의 목표는 단순한 기술 개발을 넘어, 사회적 가치를 창출하고
              인류의 지적, 정서적 성장에 기여하는 것입니다.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              혁신적인 플랫폼을 통해 다양한 생각을 나누고 사고를 넓히는데 도움을
              주는 기술을 연구하고 있습니다.
            </p>
          </div>
        </div>

        <div className="mt-16 mb-20">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Human-Centric Connection",
              "Idea Exchange",
              "Collaborative Growth",
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  {value}
                </h3>
                <p className="text-gray-600">
                  Empowering individuals through technology and community.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
