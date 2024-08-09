import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const port1Ref = useRef<MessagePort>();

  useEffect(() => {
    const channel = new MessageChannel();
    let iframeRefValue: HTMLIFrameElement;

    const loadHandler = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage("port2 from parent", "*", [
          channel.port2,
        ]);
        port1Ref.current = channel.port1;
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", loadHandler);
    }
    channel.port1.onmessage = (e) => console.log("Message from Child:", e.data);

    if (iframeRef.current) {
      iframeRefValue = iframeRef.current;
    }

    return () => {
      if (iframeRefValue) {
        iframeRefValue.removeEventListener("load", loadHandler);
      }
    };
  }, []);

  const sendMessageToChild = () => {
    if (!port1Ref?.current) return;
    port1Ref.current.postMessage("hey there, i am the parent");
  };

  return (
    <div className="container">
      <h1>App one</h1>
      <button onClick={sendMessageToChild}>Send message</button>
      <iframe
        ref={iframeRef}
        src="http://localhost:5174/"
        title="app two iframe"
      ></iframe>
    </div>
  );
}

export default App;
