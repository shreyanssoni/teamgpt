import axios from "axios"

export const dbHandlers = () => {
    
}

export const updateConversationTime = async (convoId: number) => {
    const date = await axios.post('/api/conversations/update', {
      convoId: convoId
    })
}

export async function addNewMessage(msgPayload: any) {
    // console.log(msgPayload);
    const newMsgAdded = await axios.post(
      "/api/conversations/addmessage",
      msgPayload
    );
    console.log("new message,", newMsgAdded);
    return newMsgAdded;
}
