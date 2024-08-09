import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const port2Ref = useRef<MessagePort | null>(null);

  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      console.log("message received", event);
      const port2 = event.ports[0];
      port2Ref.current = port2;

      port2.onmessage = (e: MessageEvent) => {
        console.log("Message from Parent:", e.data);
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

  const handleClick = () => {
    if (!port2Ref?.current) return;
    port2Ref.current.postMessage("MESSAGE FROM CHILD!");
  };

  return (
    <>
      <h1>App Two</h1>
      <button onClick={handleClick}>Send message to parent</button>
    </>
  );
}

export default App;
