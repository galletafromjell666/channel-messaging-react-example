import { useEffect, useRef, useState } from "react";

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
      };
    };

    window.addEventListener("message", handleIframeMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleIframeMessage);
      port2Ref.current?.close();
    };
  }, []);

  const sendMessageToIframeParent = (message: Message) => {
    if (!port2Ref?.current) return;
    port2Ref.current.postMessage(message);
  };

  const handleMessageSubmit = () => {
    const messageToSend: Message = {
      id: crypto.randomUUID(),
      text: message,
      date: new Date(),
      appName: "iframe",
    };
    sendMessageToIframeParent(messageToSend);
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
              <p className="app-name">{m.appName}</p>
              <p className="text">{m.text}</p>
              <p className="date">
                {m.date.toLocaleString("en-us", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          );
        })}
      </div>
      <form
        className="message-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleMessageSubmit();
        }}
      >
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
        <button type="submit">send to parent</button>
      </form>
    </div>
  );
}

export default App;
