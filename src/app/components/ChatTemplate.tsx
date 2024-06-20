"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { RiChatNewLine } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import { useRouter } from "next/navigation";
import SidePanel from "./SidePanel";
import styles from "./chat.module.css";
import toast, { Toaster } from "react-hot-toast";
import Dialog from "./dialog";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import InviteDialog from "./invite";
import { updateDate } from "@/drizzle/db";
import { addNewMessage, dbHandlers, updateConversationTime } from "./lib";
import ChatArea from "./ChatArea";
import { MdManageAccounts } from "react-icons/md";
import ConversationContext from "../contexts/ConversationsContext";


interface Message {
  id: number;
  content: string;
}

export default function ChatTemplate({ tokenFunction }: any) {
  const router = useRouter();
  // const [messages, setMessages] = useState<Message[]>([]);
  const [selectedTeam, setSelectedTeam] = useState(0);
  const [typing, setTyping] = useState(false);
  const [convoItem, setConvoItem] = useState([]);
  const convoRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const noCreditsRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false); 

  const {message, setMessage, messages, setMessages} = useContext(ConversationContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const logout = async () => {
    const logoutPromise = axios.get("/api/users/logout");
    toast.promise(logoutPromise, {
      loading: "Saving...",
      success: <p>Logged Out</p>,
      error: <p>Could not log out</p>,
    });
    await logoutPromise;
    router.push("/login");
  };

  async function createNewConversation(payload: any, message: string) {
    try {
      const newConv = await axios.post("/api/conversations/addnew", payload);
      console.log("printing new", newConv.data.content);

      const msgPayload = {
        newMsg: message,
        convoId: newConv.data.content.id,
      };

      await addNewMessage(msgPayload);
      // console.log("ref", convoRef);
      // setSelectedConvo(newConv.data.content.id);
      convoRef.current = newConv.data.content.id;

      setConvoItem(newConv.data.content);
      // console.log("trial")
      return newConv.data.content[0];
    } catch (error: any) {
      // console.log(error);
      if (error.response == undefined) {
        console.log(error);
        return "undefined type.";
      }
      if (error.response.status == 422) {
        toast.error("Team Credits are low.");
        await axios.post("/api/jobs/startemailjob", {
          email: tokenFunction.email,
          emailType: "CREDITS",
          content: tokenFunction.teamAdminOf[0].name
        });
        noCreditsRef.current = true;
      } else {
        console.log(error);
        toast.error("Error saving the message.");
      }

      return "error";
    }
  }

  const sendMessage = async () => {
    // console.log("message", message)
    if (noCreditsRef.current == true) {
      toast.error("Team Credits are low.");
      return;
    }
    if (message) {
      if (convoRef.current == null) {
        // create a new convo in team
        console.log("Creating new convo...");
        const slug = message.split(" ").slice(0, 2).join(" ");
        // console.log(selectedTeam, slug)
        const payload = {
          slug: slug,
          teamid: selectedTeam,
        };
        // console.log(payload);
        createNewConversation(payload, message);
      } else if (convoRef.current != null) {
        const msgPayload = {
          newMsg: message,
          convoId: convoRef.current,
        };
        addNewMessage(msgPayload);
        updateConversationTime(convoRef.current); 
      }

      setTyping(true);
      setMessages((prevMsgs: Message[]) => [
        ...prevMsgs,
        {
          id: Math.floor(Math.random() * 100),
          content: message,
        },
      ]);

      try {
        const responsePromise = axios.post("/api/conversations/llm", {
          userMessage: message,
        });

        setMessage("");
        const response = await responsePromise;
        setTyping(false);
        setMessages((prevMsgs: Message[]) => [
          ...prevMsgs,
          {
            id: Math.floor(Math.random() * 100),
            content: response.data.content,
          },
        ]);
        console.log(response.data.content)
        const msgPayload = {
          newMsg: response.data.content,
          convoId: convoRef.current,
        };
        if (convoRef.current != null) {
          addNewMessage(msgPayload);
        }
      } catch (error: any) {
        console.error("error", error);

        setMessages((prevMsgs: Message[]) => [
          ...prevMsgs,
          {
            id: Math.floor(Math.random() * 100),
            content: "Technical difficulties...try later.",
          },
        ]);

      }
    }
  };

  const updateMessages = (values: any) => {
    // console.log();
    if (values[0]) {
      setMessages(
        values[0].sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
      // setMessages(values[0]);
    } else {
      toast.error("Error loading conversations");
    }
  };

  const updateConvo = (values: any) => {
    // setSelectedConvo(values);
    convoRef.current = values;
    // console.log(values);
  };

  const updateTeam = (values: any) => {
    setSelectedTeam(values);
    // console.log(values);
  };

  const handleRemoveMember = async (id: number, teamid: number) => {
    try {
      const removingPromise = axios.post("/api/teams/remove", {
        userid: id,
        teamid: teamid,
      });
      toast.promise(removingPromise, {
          loading: "Loading...",
          success: <p>Removed!</p>,
          error: <p>Could not remove</p>,
      })
      await removingPromise;
      return "removed";
    } catch (error) {
      console.error("error removing", error);
      return "error";
    }
  };

  const handleInvite = async () => {
    setIsOpen(false); 
    setInviteOpen(true); 
  }

  const updateloading = (value: any) => {
    setLoading(value);
  };

  return (
    <div className="flex-1 flex-row">
      <div
        onClick={() => {
          setIsSidebarOpen(!isSidebarOpen);
        }}
        className={styles.sidebartogglebutton}
        style={{ position: "absolute", zIndex: 52, top: "20px", left: "14px" }}
      >
        <TbLayoutSidebarLeftCollapse
          className=" cursor-pointer"
          color="white"
          size={25}
        />
      </div>
      <div
        className={`${styles.sidepanel} ${
          isSidebarOpen ? styles.open : styles.collapsed
        }`}
      >
        <SidePanel
          updateConvo={updateConvo}
          updateTeam={updateTeam}
          convoItem={convoItem}
          tokenFunction={tokenFunction}
          updateloading={updateloading}
        />
      </div>
      <Toaster />
      <div className="flex h-screen float text-white">
        <div
          className={`bg-black absolute right-14 h-16 py-4 `}
        >
          <button
            onClick={() => setIsOpen(true)}
            style={{
              border: "1px solid #c9dfff",
              padding: "12px 18px",
              borderRadius: "40px",
              margin: "auto 14px",
              backgroundColor: '#313336',
              boxShadow: "1px 1px 6px 1px rgba(255,255,255,0.4)",
            }}
          >
            <MdManageAccounts className="inline mr-1" style={{ paddingBottom: '1px' }} size={26 }/>
            Manage Team
          </button>

          {isOpen && (
            <Dialog
              user={tokenFunction.name}
              id={tokenFunction.id}
              email={tokenFunction.email}
              team={tokenFunction.teamAdminOf[0]}
              onClose={() => setIsOpen(false)}
              onRemoveMember={handleRemoveMember}
              handleInvite={handleInvite}
            />
          )}

          {inviteOpen && (
            <InviteDialog onClose={() => setInviteOpen(false)} team={tokenFunction.teamAdminOf[0].name} id={tokenFunction.teamAdminOf[0].id}/>
          )}

          <span
            onClick={logout}
            className="absolute cursor-pointer hover:bg-red-500 p-2 mt-1 hover:text-white rounded-full"
          >
            <IoLogOutOutline size={28}/>
          </span>
        </div>
        
        {!loading && (
          <ChatArea typing={typing} sendMessage={sendMessage} noCreditsRef={noCreditsRef} />
        )}
        {loading && (
          <div className="flex justify-center items-center w-full">
            {/* <div className="text-white-100 text-center font-bold mr-1">Loading</div> */}
            <div className={styles.loader}></div>
          </div>
        )}
      </div>
    </div>
  );
}
function saveSettings(settings: any): Promise<unknown> {
  throw new Error("Function not implemented.");
}
