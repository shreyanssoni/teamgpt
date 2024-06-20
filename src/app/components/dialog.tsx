import { FC, useEffect, useRef, useState } from "react";
import { FaTimes, FaTrashAlt, FaSignOutAlt } from "react-icons/fa";
import styles from "./chat.module.css";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";

interface TeamMember {
  id: number;
  name: string;
}

interface DialogProps {
  user: string;
  id: number;
  email: string;
  team: {
    name: string;
    id: number;
    members: TeamMember[];
  };
  onClose: () => void;
  onRemoveMember: (id: number, team: number) => void;
  handleInvite: () => void;
}

const Dialog: FC<DialogProps> = ({
  user,
  id,
  email,
  team,
  onClose,
  onRemoveMember,
  handleInvite,
}) => {
  const teamRef: any = useRef(null);
  const membersRef: any = useRef(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState<number>(0);

  async function getDetails() {
    setLoading(true);
    // console.log(user, id, email, team)
    const teamsPromise = axios.post("/api/conversations/fetchTeams", {
      userid: id,
    });

    const getMembersPromise = axios.post("/api/conversations/fetchMembers", {
      teamId: team.id,
    });

    const teams = await teamsPromise;
    const members = await getMembersPromise;
    teamRef.current = [teams.data.content];
    // console.log(teamRef.current[0])
    membersRef.current = [members.data.content];
    console.log("len", membersRef.current[0][0]);
    setLoading(false);
    return teams.data.content;
  }

  // const shareInvite = async () => {
  //     const encodedBody = encodeURIComponent(`You are invited to join ${team.name} by ${user}. Click here: ${process.env.NEXT_DOMAIN}//jointeam?team=${team.name}&${team.id}\n`);
  //     window.location.href = `mailto:${email}?subject=${`Invited to join ${team.name}`}&body=${encodedBody}`;
  //   }

  useEffect(() => {
    getDetails();

    // console.log(teamRef);
  }, [refresh]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="bg-gray-100 rounded-3xl text-black shadow-slate-300 shadow-sm w-full z-30 max-w-lg p-5 relative">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600" />
          </button>
        </div>
        <div className="mt-5 ml-1 text-black">
          <h3 className="text-lg font-medium">Teams I am part of: </h3>
          {loading && (
            <div className="flex justify-center items-center">
              {/* <div className="text-white-100 text-center font-bold mr-1">Loading</div> */}
              <div className={styles.loader}></div>
            </div>
          )}{" "}
          {!loading && (
            <ul className="mt-2">
              {teamRef.current[0].map((member: any) => (
                <li
                  key={member.teams.id}
                  className="flex bg-slate-200 p-2 rounded-lg hover:bg-slate-300 justify-between items-center mt-1"
                >
                  {member.teams.name}
                  <button
                    onClick={() => {
                      setLoading(true);
                      onRemoveMember(id, team.id);
                      setRefresh(id);
                      setLoading(false);
                    }}
                    className="text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 ml-1">
          <h3 className="text-lg text-black font-medium">
            Members of <span className="font-bold">{team.name}</span>:
          </h3>
          {loading && (
            <div className="flex justify-center items-center">
              {/* <div className="text-white-100 text-center font-bold mr-1">Loading</div> */}
              <div className={styles.loader}></div>
            </div>
          )}{" "}
          {!loading && (
            <ul className="mt-2 text-black">
              {membersRef.current[0].length > 0 &&
                membersRef.current[0].map((item: any) => (
                  <li
                    key={item.id}
                    className="flex bg-slate-200 p-2 rounded-lg hover:bg-slate-300 justify-between items-center mt-1"
                  >
                    {item.name}
                    <button
                      onClick={() => {
                        setLoading(true);
                        if (item.id != team.id) {
                          onRemoveMember(item.id, team.id);
                        }
                        setLoading(false);
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      {/* <FaSignOutAlt /> */}
                      <span className="text-sm">Remove</span>
                    </button>
                  </li>
                ))}
              {membersRef.current[0].length == 0 && (
                <span className="text-sm text-gray-500">
                  No Members in Team Found
                </span>
              )}
            </ul>
          )}
        </div>
        <div className="ml-1">
          <button
            onClick={handleInvite}
            className="hover:bg-blue-500 text-blue-600 hover:border-none border border-blue-600 hover:text-white transition"
            style={{
              marginTop: "15px",
              zIndex: "50",
              padding: "2px 6px",
              borderRadius: "12px",
            }}
          >
            <FaPlus className="inline mb-1" size={12} /> Invite
          </button>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white border rounded hover:bg-blue-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
