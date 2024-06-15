import ChatTemplate from "./components/ChatTemplate";
import SidePanel from "./components/SidePanel";

export default function Home() {
  return (
    <>
      <div className="flex-1 flex-row">
        <SidePanel />
        <ChatTemplate/> 
      </div>
    </>
  );
}
