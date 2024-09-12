import React from "react";

interface Member {
  nickname: string;
  job: string;
  profile: string;
  role: "host" | "guest";
}

interface MemberListProps {
  members: Member[];
}

const MemberList: React.FC<MemberListProps> = ({ members = [] }) => {
  return (
    <div className="flex-1 overflow-y-auto h-[100%] p-2 rounded-lg">
      {members && members.length > 0 ? (
        members.map((member, index) => (
          <div key={index} className="flex items-center overflow-y-auto">
            <div className="relative">
              <img
                src={member.profile || "/images/user-profile.png"}
                alt={member.nickname}
                className="w-10 h-10 bg-gray-300 rounded-full mr-2"
              />
              {member.role === "host" && (
                <img
                  src="/images/crown.png"
                  className="w-[15px] h-[15px] bg-opacity-100 absolute top-0 right-[8px]"
                  alt="crown"
                />
              )}
            </div>

            <div>
              <div className="text-[16px] font-[700] text-[#323232]">
                {member.nickname}
              </div>
              <div className="text-[16px] text-[#A6046D]">{member.job}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-center">멤버 로딩중...</div>
      )}
    </div>
  );
};

export default MemberList;
