import { FC, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';

interface InviteDialogProps {
  onClose: () => void;
  team: string;
  id: number; 
}

const InviteDialog: FC<InviteDialogProps> = ({ onClose, team, id }) => {
  const [email, setEmail] = useState('');

  const handleInvite = async () => {
    toast.promise(
      axios.post('/api/jobs/startemailjob', { 
        email: email,
        emailtype: "INVITE",
        content: `team=${team}&id=${id}`
     }),
      {
        loading: 'Sending invite...',
        success: 'Invite sent successfully!',
        error: 'Failed to send invite',
      }
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Toaster />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Invite</h2>
          <button onClick={onClose} className="text-gray-600">
            <FaTimes />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Enter the email address to invite
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email address"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleInvite} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteDialog;
