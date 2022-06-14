import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import Peer from "simple-peer";
import SocketIOClient from "socket.io-client";
import StudentsMediaVideoList from "../../../components/Invigilation/StudentsMediaVideoList";
import { useHttpClient } from "../../../hooks/http-hook";

import styles from "./Invigilation.module.css";

export default function InvigilationPage() {
  const socket = useRef(null);
  const [studentStreams, setStudentStreams] = useState(new Map());
  // a function to put value into the state map immutably.
  const putInStudentStreamsMap = (k, v) => {
    setStudentStreams(new Map(studentStreams.set(k, v)));
  };

  const router = useRouter();

  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();

  const getIPAddress = async () => {
    return await sendRequest("https://geolocation-db.com/json/", "GET");
  };

  const updateInvigilationInstanceInfo = async (socketID) => {
    const { IPv4 } = await getIPAddress();
    const examID = router.query.examID;
    const invigilationInfoUpdate = {
      socketID: id,
      instanceIP: IPv4,
      examID: examID
    };
    await sendRequest(
      "http://localhost:5000/exam-management/update-exam-invigilation-info",
      "PATCH",
      JSON.stringify(invigilationInfoUpdate),
      { "Content-Type": "application/json" }
    );
  };

  useEffect(() => {
    socket.current = SocketIOClient.connect("http://localhost:5000", {
      path: "/invigilation"
    });

    socket.current.on("givenSocketID", async (id) => {
      await updateInvigilationInstanceInfo(id);
    });

    socket.current.on("incomingConnection", (data) => {
      const { studentSocketID, username, signal } = data;
      acceptIncomingConnection(username, studentSocketID, signal);
    });
  }, []);

  const acceptIncomingConnection = async (
    studentUsername,
    studentSocketID,
    studentSignal
  ) => {
    const peer = new Peer({
      initiator: false
    });

    /*
      Listen on signal from student. When a signal is received, signal the user back as handshake process.
    */
    peer.on("signal", (data) => {
      console.log("Received signal: ", data);
      socket.current.emit("acceptIncomingConnection", {
        signal: data,
        toStudentSocketID: studentSocketID
      });
    });

    /*
      On receiving stream from student, add it to the map of streams keyed to the student username.
    */
    peer.on("stream", (stream) => {
      putInStudentStreamsMap(studentUsername, stream);
    });

    peer.signal(studentSignal);
  };

  return (
    <main>
      <StudentsMediaVideoList studentStreams={studentStreams} />
    </main>
  );
}
