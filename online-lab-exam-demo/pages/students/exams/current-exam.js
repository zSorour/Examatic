import React, { useEffect, useState, useRef, useContext } from "react";

import dynamic from "next/dynamic";
import Peer from "simple-peer";
import SocketIOClient from "socket.io-client";

import { useHttpClient } from "../../../hooks/http-hook";

import AuthContext from "../../../store/auth-context/authContext";
import CurrentExamContext from "../../../store/current-exam-context/currentExamContext";

const VNCScreen = dynamic(() =>
  import("../../../components/VNCScreen/VNCScreen", { ssr: false })
);

export default function CurrentExamPage() {
  const socket = useRef(null);
  const [mySocketID, setMySocketID] = useState(null);
  const [invigilationInstanceSocketID, setInvigilationInstanceSocketID] =
    useState(null);

  const authCTX = useContext(AuthContext);
  const currentExamContext = useContext(CurrentExamContext);

  const { isLoading, errorTitle, errorDetails, sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchExamInvigilationInfo = async () => {
      const { exam } = await sendRequest(
        `http://localhost:5000/exam-management/?examID=${currentExamContext.examID}`,
        "GET"
      );
      console.log(exam);
      setInvigilationInstanceSocketID(exam.invigilationInstance.socketID);
    };

    fetchExamInvigilationInfo();

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
        toInvigilationSocketID: invigilationInstanceSocketID,
        signal: data,
        username: authCTX.username
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
      <div>
        <button onClick={shareStudentMediaToInvigilationInstance}>
          Share Screen
        </button>
        <VNCScreen />
      </div>
    </div>
  );
}
