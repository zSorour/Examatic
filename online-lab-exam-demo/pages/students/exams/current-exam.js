import React, { useEffect, useState, useRef, useContext } from "react";

import dynamic from "next/dynamic";
import Peer from "simple-peer";
import SocketIOClient from "socket.io-client";

import AuthContext from "../../../store/auth-context/authContext";

const VNCScreen = dynamic(() =>
  import("../../../components/VNCScreen/VNCScreen", { ssr: false })
);

export default function CurrentExamPage() {
  const socket = useRef(null);
  const [studentStream, setStudentStream] = useState(null);
  const [mySocketID, setMySocketID] = useState(null);
  const authCTX = useContext(AuthContext);
  const [invigilationInstanceSocketID, setInvigilationInstanceSocketID] =
    useState(null);

  useEffect(() => {
    // TODO: fetch invigilation instance socket ID from backend and set it as state variable.

    socket.current = SocketIOClient.connect(
      "http://localhost:5000/invigilation"
    );

    socket.current.on("givenSocketID", (id) => {
      setMySocketID(id);
    });

    const media = getStudentMedia({ audio: true, video: true });
    setStudentStream(media);

    shareStudentMediaToInvigilationInstance();
  }, []);

  const getStudentMedia = async (constraints) => {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (err) {
      console.log(err);
    }
  };

  const shareStudentMediaToInvigilationInstance = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: studentStream
    });

    peer.on("signal", (data) => {
      socket.current.emit("outgoingConnection", {
        fromStudentSocketID: mySocketID,
        toInvigilationSocketID: invigilationInstanceSocketID,
        signal: data,
        username: authCTX.username
      });
    });

    socket.current.on("callAccepted", (signal) => {
      peer.signal(signal);
    });
  };

  return (
    <div>
      <main>
        <VNCScreen />
      </main>
    </div>
  );
}
