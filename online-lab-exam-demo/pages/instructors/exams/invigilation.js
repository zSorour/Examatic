import { useEffect, useRef } from "react";
import Peer from "peerjs";
export default function InvigilationPage() {
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // TODO: Check if there exists a peer ID from the backend
    // If there is, use it. Else, create new id using Peer Constructor.
    // then save Peer ID in DB.
    const peerInstance = new Peer({
      host: "localhost",
      port: 5000,
      path: "peerjs-broker"
    });

    peerInstance.on("open", (id) => {
      console.log(`Invigilation instance ID: ${id}`);

      // on receiving a call from any peer.
      peerInstance.on("call", (call) => {
        call.answer();
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });
  }, []);

  return (
    <div>
      <video ref={remoteVideoRef} />
    </div>
  );
}
