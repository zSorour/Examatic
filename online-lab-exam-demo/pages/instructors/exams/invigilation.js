import React, { useState, useRef, useEffect } from "react";

import Peer from "simple-peer";
import SocketIOClient from "socket.io-client";
import StudentsMediaVideoList from "../../../components/Invigilation/StudentsMediaVideoList";

import styles from "./Invigilation.module.css";

export default function InvigilationPage() {
  const socket = useRef(null);
  const [studentStreams, setStudentStreams] = useState(new Map());
  const [mySocketID, setMySocketID] = useState(null);

  // a function to put value into the state map immutably.
  const putInStudentStreamsMap = (k, v) => {
    setStudentStreams(new Map(studentStreams.set(k, v)));
  };

  useEffect(() => {
    socket.current = SocketIOClient.connect("http://localhost:5000", {
      path: "/invigilation"
    });

    socket.current.on("givenSocketID", (id) => {
      setMySocketID(id);
    });

    socket.current.on("incomingConnection", (data) => {
      const { studentSocketID, username, signal } = data;
      console.log("incoming connection: ", data);
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
      console.log("Received stream!!!");
      putInStudentStreamsMap(studentUsername, stream);
    });

    // ??? is this needed?
    peer.signal(studentSignal);
  };

  return (
    <main>
      <StudentsMediaVideoList studentStreams={studentStreams} />
    </main>
  );
}
