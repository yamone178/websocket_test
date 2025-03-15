import { useState, useEffect } from "react";

const WebSocketChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const ws = new WebSocket("wss://s14291.nyc1.piesocket.com/v3/1?api_key=lAroeBpS6oqkdwaVbe6iciHECWBRbWSHKxhFakCg&notify_self=1");
    console.log(ws);
    
    ws.onopen = () => console.log("WebSocket connected");

    ws.onmessage = (event) => {
        console.log(event.data, input);
        
        setMessages((prev) => {
            if (prev.length > 0 && prev[prev.length - 1].text === event.data) {
              return prev;
            }
            return [...prev, { text: event.data, sender: "server" }];
          });
    };
    ws.onclose = () => console.log("WebSocket disconnected");
    
    setSocket(ws);
    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && input.trim() !== "") {
      socket.send(input);
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      setInput("");
    }
  };
  console.log(messages);
  

  return (
    <div className="w-full max-w-lg mx-auto p-4 border rounded-lg shadow-lg">
      <div className="h-64 overflow-y-auto  p-2 mb-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-lg max-w-[80%] ${
              msg.sender === "user" ? " bg-black text-white ml-auto" : "bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-lg"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className=" bg-black text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default WebSocketChat;
