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

const MemberList: React.FC<MemberListProps> = ({ members }) => {
  // const [members, setMembers] = useState<Member[]>([]);

  // useEffect(() => {
  //   const fetchMembers = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/api/user`
  //       );
  //       setMembers(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch members:", error);
  //     }
  //   };

  //   fetchMembers();
  // }, []);

  return (
    <div className="flex-1 overflow-y-auto border-1 h-[100%] p-2 rounded-lg">
      {members.map((member, index) => (
        <div key={index} className="flex items-center mb-4">
          <img
            src={member.profile || "/default-profile.png"}
            alt={member.nickname}
            className="w-10 h-10 bg-gray-300 rounded-full mr-2"
          />
          <div>
            <div className="text-lg font-bold">{member.nickname}</div>
            <div className="text-sm text-gray-500">{member.job}</div>
            <div className="text-sm text-gray-700">
              {member.role === "host" && " (Host)"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
