import { FC, useEffect, useRef, useState } from 'react';
import { FaTimes, FaTrashAlt, FaSignOutAlt } from 'react-icons/fa';
import styles from './chat.module.css'
import axios from 'axios';

interface TeamMember {
  id: number;
  name: string;
}

interface DialogProps {
  user: string;
  id: number;
  team: {
    name: string;
    id: number; 
    members: TeamMember[];
  };
  otherTeams: string[];
  onClose: () => void;
  onRemoveMember: (id: number) => void;
  onWithdraw: (team: string) => void;
}

const Dialog: FC<DialogProps> = ({ user, id, team, otherTeams, onClose, onRemoveMember, onWithdraw }) => {
    
    const teamRef:any = useRef(null);
    const membersRef:any = useRef(null);
    const [loading, setLoading] = useState(true);
    
    async function getDetails(){
      setLoading(true); 
      const teamsPromise = axios.post('/api/conversations/fetchTeams' , {
        userid: id
      })

      const getMembersPromise = axios.post('/api/conversations/fetchMembers', {
        teamId: team.id
      })

      const teams = await teamsPromise;
      const members = await getMembersPromise; 
      teamRef.current = [teams.data.content[0].teams]; 
      membersRef.current = [members.data.content];
      // console.log("len", membersRef.current[0].length)
      setLoading(false); 
      return teams.data.content; 
      
    }

    useEffect(() => {
        getDetails()

        console.log(teamRef);
    }, [])

    return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="bg-gray-100 rounded-lg text-black shadow-lg w-full z-30 max-w-md p-6 relative">
        <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Settings</h2>
        <button onClick={onClose}>
          <FaTimes className="text-gray-600" />
        </button>
      </div>
      <div className="mt-4 text-black">
        <h3 className="text-lg font-medium">Teams I am part of: </h3>
        {loading && (
            <div className="flex justify-center items-center">
            {/* <div className="text-white-100 text-center font-bold mr-1">Loading</div> */}
            <div className={styles.loader}></div>
          </div>
        )
        } {!loading && (
          <ul className="mt-2">
          {teamRef.current.map((member:any) => (
            <li key={member.id} className="flex justify-between items-center mt-1">
              {member.name}
              <button onClick={() => onRemoveMember(member.id)} className="text-red-500">
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
        )}
        
      </div>
      <div className="mt-4">
        <h3 className="text-lg text-black font-medium">Members of {team.name}:</h3>
        {loading && (
            <div className="flex justify-center items-center">
            {/* <div className="text-white-100 text-center font-bold mr-1">Loading</div> */}
            <div className={styles.loader}></div>
          </div>
        )
        } {!loading && (
        <ul className="mt-2 text-black">
          {membersRef.current[0].length > 0 && membersRef.current.map((item:any) => (
            <li key={item.id} className="flex justify-between items-center mt-1">
              {item.name}
              <button onClick={() => {
              {console.log(item.id, team.id)}
                if(item.id != team.id) onWithdraw(item.id)
                }} className="text-yellow-500">
                {/* <FaSignOutAlt /> */}
                <span className='text-sm'>Remove</span>
              </button>
            </li>
          ))}
          {
            membersRef.current[0].length == 0 && (
              <span className='text-sm text-gray-500'>No Members in Team Found</span>
            )
          }
        </ul>
      )}
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded">
          Cancel
        </button>
        <button className="px-4 py-2 bg-white text-black border border-black rounded">
          Save
        </button>
      </div>        
      </div>
    </div>
  );
};

export default Dialog;
 