import React, { useState, useRef, useEffect } from "react";

import Peer from "simple-peer";
import SocketIOClient from "socket.io-client";
import StudentsMediaVideoList from "../../../components/Invigilation/StudentsMediaVideoList";

import styles from "./Invigilation.module.css";

export default function InvigilationPage() {
  const socket = useRef(null);
  const [studentStreams, setStudentStreams] = useState(new Map());

  // a function to put value into the state map immutably.
  const putInStudentStreamsMap = (k, v) => {
    setStudentStreams(studentStreams.set(k, v));
  };

  useEffect(() => {
    socket.current = SocketIOClient.connect(
      "http://localhost:5000/invigilation"
    );

    socket.current.on("incomingConnection", (data) => {
      const studentUsername = data.from;
      const studentSignal = data.signal;
      acceptIncomingConnection(studentUsername, studentSignal);
    });
  }, []);

  const acceptIncomingConnection = async (studentUsername, studentSignal) => {
    const peer = new Peer({
      initiator: false
    });

    /*
      Listen on signal from student. When a signal is received, signal the user back as handshake process.
    */
    peer.on("signal", (data) => {
      socket.current.emit("accept-incoming-connection", {
        signal: data,
        to: studentUsername
      });
    });

    /*
      On receiving stream from student, add it to the map of streams keyed to the student username.
    */
    peer.on("stream", (stream) => {
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
