import React from "react";

const members = [
  { name: "기획자", job: "기획자" },
  { name: "택시기사", job: "택시기사" },
  { name: "바리스타", job: "바리스타" },
  { name: "무직", job: "무직" },
  { name: "교사", job: "교사" },
];

const MemberList: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      {members.map((member, index) => (
        <div key={index} className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
          <div>
            <div className="text-lg font-bold">{member.name}</div>
            <div className="text-sm text-gray-500">{member.job}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
