import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import Peer from "peerjs";

const VNCScreen = dynamic(() =>
  import("../components/VNCScreen/VNCScreen", { ssr: false })
);

export default function Exam() {
  // Typically, remotePeerID should be retrieved from backend!
  const [remotePeerID, setRemotePeerID] = useState("");

  const peerInstanceRef = useRef(null);

  //useEffect for getting peer id from peerjs broker.
  useEffect(() => {
    const peer = new Peer({
      host: "localhost",
      port: 5000,
      path: "peerjs-broker"
    });

    peerInstanceRef.current = peer;
  }, []);

  const connectToPeer = async (targetID) => {
    const studentMedia = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });
    peerInstanceRef.current.call(targetID, studentMedia);
  };

  return (
    <div>
      <main>
        <div>
          <input
            value={remotePeerID}
            onChange={(e) => setRemotePeerID(e.target.value)}
          />
          <button onClick={() => connectToPeer(remotePeerID)}>Connect</button>
        </div>

        <h1>Hello Everyone! Enjoy a great demo!</h1>
        <VNCScreen />
      </main>
    </div>
  );
}
