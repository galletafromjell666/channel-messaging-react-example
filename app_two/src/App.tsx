import { useEffect, useRef, useState } from "react";
import "./App.css";

interface Message {
  id: string; //UUID
  appName: "parent" | "iframe";
  text: string;
  date: Date;
}

function App() {
  const port2Ref = useRef<MessagePort | null>(null);
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      /**
       * It is good security practice to validate received messages.
       * If the expected sender's origin is known, enhance validation:
       *
       *  if (event.origin !== "http://localhost:5173/") return
       *
       */
      if (event.data !== "port2 from parent") return;
      const port2 = event.ports[0];
      port2Ref.current = port2;

      port2.onmessage = (e: MessageEvent) => {
        setMessageHistory((prevMessageHistory) =>
          prevMessageHistory.concat([e.data])
        );

        port2.start();
      };
    };
    window.addEventListener("message", handleIframeMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleIframeMessage);
      port2Ref.current?.close();
    };
  }, []);

  const sendMessageToIframe = (message: Message) => {
    if (!port2Ref?.current) return;
    port2Ref.current.postMessage(message);
  };

  const handleSendButton = () => {
    const messageToSend: Message = {
      id: crypto.randomUUID(),
      text: message,
      date: new Date(),
      appName: "iframe",
    };
    sendMessageToIframe(messageToSend);
    setMessage("");
    setMessageHistory((prevMessageHistory) =>
      prevMessageHistory.concat([messageToSend])
    );
  };

  return (
    <div className="chat">
      <div className="chat-history">
        {messageHistory.map((m) => {
          const isIncomingMessage = m.appName === "parent";
          return (
            <div
              className={`message ${isIncomingMessage ? "incoming" : ""}`}
              key={m.id}
            >
              <p>{m.appName}</p>
              <p>{m.text}</p>
              <p>{m.date.toDateString()}</p>
            </div>
          );
        })}
      </div>
      <div className="message-form">
        <input
          type="text"
          name="message"
          id="message"
          placeholder="type your message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button onClick={handleSendButton}>send message</button>
      </div>
    </div>
  );
}

export default App;
