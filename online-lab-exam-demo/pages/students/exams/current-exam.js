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
  const [mySocketID, setMySocketID] = useState(null);
  const authCTX = useContext(AuthContext);
  const [invigilationInstanceSocketID, setInvigilationInstanceSocketID] =
    useState(null);

  useEffect(() => {
    // TODO: fetch invigilation instance socket ID from backend and set it as state variable.

    socket.current = SocketIOClient.connect("http://localhost:5000", {
      path: "/invigilation"
    });

    socket.current.on("givenSocketID", (id) => {
      setMySocketID(id);
    });
  }, []);

  const getStudentScreenMedia = async (constraints) => {
    let stream;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      return stream;
    } catch (err) {
      console.log(err);
    }
  };

  const shareStudentMediaToInvigilationInstance = async () => {
    const media = await getStudentScreenMedia({ audio: true, video: true });

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: media
    });

    peer.on("signal", (data) => {
      console.log(mySocketID);
      socket.current.emit("outgoingConnection", {
        fromStudentSocketID: mySocketID,
        toInvigilationSocketID: "MZnuX3Xp18rdYnJPAADZ",
        signal: data,
        username: "ahmad186081"
      });
    });

    socket.current.on("connectionAccepted", (signal) => {
      console.log("Connection Accepted");
      console.log(signal);
      peer.signal(signal);
    });
  };

  return (
    <div>
      <main>
        <button onClick={shareStudentMediaToInvigilationInstance}>
          Share Screen
        </button>
        <VNCScreen />
      </main>
    </div>
  );
}
