import { useEffect, useRef, useState } from "react";
import "./App.css";

interface Message {
  id: string; //UUID
  appName: "parent" | "iframe";
  text: string;
  date: Date;
}

const iframeOrigin = "http://localhost:5174/";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const port1Ref = useRef<MessagePort>();

  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const channel = new MessageChannel();
    let iframeRefValue: HTMLIFrameElement;

    const loadHandler = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          "port2 from parent",
          // It is good security practice to send messages only to known origins.
          iframeOrigin, 
          [channel.port2]
        );
        port1Ref.current = channel.port1;
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", loadHandler);
    }
    channel.port1.onmessage = (e: MessageEvent) => {
      setMessageHistory((prevMessageHistory) =>
        prevMessageHistory.concat([e.data])
      );
    };

    if (iframeRef.current) {
      iframeRefValue = iframeRef.current;
    }

    return () => {
      if (iframeRefValue) {
        iframeRefValue.removeEventListener("load", loadHandler);
      }
    };
  }, []);

  const sendMessageToIframe = (message: Message) => {
    if (!port1Ref?.current) return;
    port1Ref.current.postMessage(message);
  };

  const handleSendButton = () => {
    const messageToSend: Message = {
      id: crypto.randomUUID(),
      text: message,
      date: new Date(),
      appName: "parent",
    };
    sendMessageToIframe(messageToSend);
    setMessage("");
    setMessageHistory((prevMessageHistory) =>
      prevMessageHistory.concat([messageToSend])
    );
  };

  return (
    <div className="chat-layout">
      <div className="chat">
        <div className="chat-history">
          {messageHistory.map((m) => {
            const isIncomingMessage = m.appName === "iframe";
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
      <iframe ref={iframeRef} src={iframeOrigin} title="app two iframe" />
    </div>
  );
}

export default App;
